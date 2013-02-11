jQuery-ajaxPing
===============

Easily ping a URL to keep sessions alive.

Usage:-
```javascript
$.ajaxPing({
    request: {
        url: '/ajax/ping'
    },
    retryOnFailure: true,
    retryAttempts: 5,
    interval: {
        duration: 10
    },
    retryIntervalFunction: function (attempts) {
        return {
            duration: 1,
            period: 'minute'
       }
    }
});
```
