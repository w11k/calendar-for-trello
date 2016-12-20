'use strict';
angular.module('trelloCal').run(/*ngInject*/ function ($location, $rootScope, webStorage, $mdToast) {
    if ($location.$$protocol !== 'http' && $location.$$protocol !== 'https') {
        $rootScope.mobil = true;
    }
    if (webStorage.has('trello_token')) {
        if ($location.path() === '/') {
            $location.path('/app/month');

        }
    }

    $rootScope.$on( 'httpError', function( event, rejection ) {
        var errorMessage = 'API ERROR - Something went wrong';
        switch (rejection.status) {
            case 429:
                errorMessage = 'To many requests to Trello API';
                break;
            case 401:
                errorMessage = 'Authentication issue with Trello API';
                break;
        }
        $mdToast.show(
            $mdToast.simple()
                .textContent(errorMessage)
                .position('bottom right')
                .hideDelay(5000)
        );
    });


});