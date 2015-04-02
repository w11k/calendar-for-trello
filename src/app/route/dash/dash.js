'use strict';/*
angular.module('starter.dash', []);
angular.module('starter').config(function($stateProvider) {
    $stateProvider
        .state('tab.dash', {
            url: '/dash',
            views: {
                'menuContent': {
                    templateUrl: 'route/dash/dash.html',
                    controller: 'DashCtrl'
                }
            }
        });
});




angular.module('starter').run(function( ) {
});

angular.module('starter.dash').controller('DashCtrl', function($scope, $location, $rootScope,dataService) {

    $scope.login = dataService.checkLogin();
    $scope.auth = function(){
                 $location.path("/tab/month/")

    };

    $scope.logout = function(){
        $scope.$apply(function(){
        Trello.deauthorize();
        dataService.remove();
        console.log(dataService.get());
        })
    };

});*/