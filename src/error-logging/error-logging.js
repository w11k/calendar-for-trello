'use strict';

var app = angular.module( 'trelloCal.errorLogging', ['ngRaven']);
app.config(function($provide,$httpProvider) {
    // Capture Angular Errors
    $provide.decorator('$exceptionHandler', ['$delegate', '$raven', function ($delegate, $raven) {
        return function (exception, cause) {
            $delegate(exception, cause);
            $raven.captureException(exception);
        };
    }]);


    // in addition, capture XHR Errors
    $httpProvider.interceptors.push(['$q', '$raven', function($q,$raven) {
        return {
            responseError: function(rejection) {
                $raven.captureException(rejection.data+rejection.status);
                return $q.reject(rejection);
            }
        };
    }]);
});
