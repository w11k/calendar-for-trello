'use strict';

var app = angular.module( 'trelloCal.errorLogging', ['ngRaven'] );
app.config(function($provide) {
    $provide.decorator('$exceptionHandler', ['$delegate', '$raven', function ($delegate, $raven) {
        return function (exception, cause) {
            $delegate(exception, cause);
            $raven.captureException(exception);
        };
    }]);
});
