'use strict';
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
            }/*,
            resolve:{
                authService:"authService"
        }*/

        });
});




angular.module('starter').run(function($rootScope) {
    var onSuccess = function(){
        $rootScope.login = true;
    }

    Trello.authorize({
        interactive: false,
        success: onSuccess
    });

});

angular.module('starter.dash').controller('DashCtrl', function($scope,authService, $location, $rootScope) {
$scope.login = $rootScope.login;


    $scope.auth = function(){
        $location.path("/tab/month/")
    }

   // $scope.login = authService.async();


   // if ($scope.login === true){
   //     $location.path("tab/month/")
    //}


    //console.log($scope.login)

});