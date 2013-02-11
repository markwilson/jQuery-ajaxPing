(function ($) {
    $.ajaxPing = function (options) {
        var _this = this;

        var defaultOptions = {
            request: {
                url: function () {
                    throw Error('No URL provided to ping');
                },
                cache: false,
                error: responseError
            },
            retryOnFailure: false,
            startImmediately: false,
            retryAttempts: 0,
            interval: {
                duration: 1,
                period: 'minutes'
            },
            retryIntervalFunction: function () {
                throw Error('No retry interval function provided');
            }
        };

        options = $.extend(true, defaultOptions, options);
        var requestOptions = options.request;


        function _getIntervalMilliseconds(interval) {
            var intervalMultiplier;

            switch (interval.period) {
                case 'milliseconds':
                case 'millisecond':
                case 'ms':
                    intervalMultiplier = 1;
                    break;

                case 'seconds':
                case 'second':
                case 'secs':
                case 'sec':
                case 's':
                    intervalMultiplier = 1000;
                    break;

                case 'minutes':
                case 'minute':
                case 'mins':
                case 'min':
                case 'm':
                    intervalMultiplier = 60000;
                    break;

                case 'hours':
                case 'hour':
                case 'hrs':
                case 'hr':
                case 'h':
                    intervalMultiplier = 3600000;
                    break;

                default:
                    throw Error('Invalid interval period provided: ' + interval.period);
            }

            return (interval.duration * intervalMultiplier);
        }

        function pingFunction() {
            var url,
                getType = {};

            if (requestOptions.url && getType.toString.call(requestOptions.url) === '[object Function]') {
                url = requestOptions.url.call(this);
            } else {
                url = requestOptions.url;
            }

            $.ajax(requestOptions);

            // initialise the next ping
            setTimeout(pingFunction, _getIntervalMilliseconds(options.interval));
        }

        var attemptsCount = 0;

        function responseError(xhr, status, error) {
            if (!options.retryOnFailure) {
                return;
            }

            if (attemptsCount >= options.retryAttempts) {
                return;
            }

            setTimeout(function () {
                attemptsCount++;
                pingFunction.call(_this);
            }, _getIntervalMilliseconds(options.retryIntervalFunction(attemptsCount)));
        }

        // initial ping request
        if (options.startImmediately) {
            pingFunction();
        } else {
            setTimeout(pingFunction, _getIntervalMilliseconds(options.interval));
        }
    };
})(jQuery);
