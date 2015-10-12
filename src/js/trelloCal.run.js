'use strict';
angular.module('trelloCal').run(/*ngInject*/ function ($location, $rootScope, webStorage) {
    if ($location.$$protocol !== 'http' && $location.$$protocol !== 'https') {
        $rootScope.mobil = true;
    }
    if (webStorage.has('trello_token')) {
        if ($location.path() === '/') {
            $location.path('/app/month');

        }
    }
    else {
        webStorage.clear();
    }
});