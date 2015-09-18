'use strict';
var settings = angular.module('trelloCal.settings', []);
settings.config(/*ngInject*/ function () {

});

settings.controller('settingsCtrl', function($scope, localStorageService,$window) {

    $scope.settings = [
        {id: 'refresh', name: 'auto refresh',  icon: 'sync', enabled: localStorageService.get('refresh') === true, disabled: false },
        //{id: 'filter',  name: 'filter board',  icon: 'filter_list', enabled: localStorageService.get('filter') === true || localStorageService.get('filter') === null, disabled: false },
        {id: 'boardColors',  name: 'colorize cards',  icon: 'color_lens', enabled: localStorageService.get('boardColors') === true || localStorageService.get('boardColors') === null, disabled: false },
        {id: 'startMonth',  name: 'start with month',  icon: 'today', enabled: localStorageService.get('startMonth') === true || localStorageService.get('startMonth') === null, disabled: false },
        {id: 'observerMode',  name: 'observer mode (show cards of all    members)',  icon: 'group', enabled: localStorageService.get('observerMode') === true || localStorageService.get('observerMode') === null, disabled: false }
    ];

    $scope.change = function (id, opt) {

        localStorageService.set(id, opt);
        if(id === 'boardColors' || id === 'observerMode') {
            $window.location.reload();
        }
    };
});