/* jshint ignore:start */

// Create an application module for our demo.
var app = angular.module( "trelloCal.errorLogging", ['ngRaven'] );

app .config(function($ravenProvider) {
    // There is a development flag to log errors rather than sending it to Sentry
    $ravenProvider.development(false);
});



app.provider(
    "$exceptionHandler",
    {
        $get: function( errorLogService ) {
            return( errorLogService );
        }
    }
);

app.factory(
    "errorLogService",
    function( $log, $window, $raven ) {
        function log( exception, cause ) {
            $log.error.apply( $log, arguments );
            try {
                $raven.captureException(exception , {extra: {cause: $log}});
            } catch ( loggingError ) {
                $log.warn( "Error logging failed" );
                $log.log( loggingError );
            }
        }
        return( log );
    }
);


/* jshint ignore:end */
