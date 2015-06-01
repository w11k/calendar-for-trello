/* jshint ignore:start */

// Create an application module for our demo.
var app = angular.module( "trelloCal.errorLogging", ['ngRaven'] );

app .config(function($ravenProvider) {
    // There is a development flag to log errors rather than sending it to Sentry
    $ravenProvider.development(false);
});


// The "stacktrace" library that we included in the Scripts
// is now in the Global scope; but, we don't want to reference
// global objects inside the AngularJS components - that's
// not how AngularJS rolls; as such, we want to wrap the
// stacktrace feature in a proper AngularJS service that
// formally exposes the print method.
app.factory(
    "stacktraceService",
    function() {

        // "printStackTrace" is a global object.
        return({
            print: printStackTrace
        });

    }
);


// -------------------------------------------------- //
// -------------------------------------------------- //


// By default, AngularJS will catch errors and log them to
// the Console. We want to keep that behavior; however, we
// want to intercept it so that we can also log the errors
// to the server for later analysis.
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
    function( $log, $window, stacktraceService,$raven ) {
        function log( exception, cause ) {

            $log.error.apply( $log, arguments );

            try {

                var errorMessage = exception.toString();
                var stackTrace = stacktraceService.print({ e: exception });
                $raven.captureException(stackTrace , {extra: {cause: errorMessage}});

            } catch ( loggingError ) {

                // For Developers - log the log-failure.
                $log.warn( "Error logging failed" );
                $log.log( loggingError );


            }

        }

        // Return the logging function.
        return( log );

    }
);


/* jshint ignore:end */
