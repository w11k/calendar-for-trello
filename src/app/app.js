'use strict';

angular.module('w11kcal.app', [
    'ionic',
    'w11kcal.app.month',
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker',
    'ngDraggable',
    'angular-loading-bar',
    'ui-notification',
    'LocalStorageModule'
]);

angular.module('w11kcal.app').run( /*ngInject*/ function ($ionicPlatform, $window,  $rootScope, cfpLoadingBar) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if ($window.cordova && $window.cordova.plugins.Keyboard) {
            $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if ($window.StatusBar) {
            // org.apache.cordova.statusbar required
            $window.StatusBar.styleDefault();
        }
    });


    $rootScope
        .$on('$stateChangeStart',
        function(){
            cfpLoadingBar.start();

        });

    $rootScope
        .$on('$stateChangeSuccess',
        function(){ // Options: event, toState, toParams, fromState, fromParams
            cfpLoadingBar.complete();
        });


});

angular.module('w11kcal.app').config(/*ngInject*/ function ($stateProvider, $urlRouterProvider,$ionicConfigProvider,localStorageServiceProvider) {
    moment.locale('de');

    $stateProvider
        // setup an abstract state for the sidebar
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'partial/sidemenu.html',
            controller:'sidebarCtrl'
        })

        .state('app.token', {
            url: '/token?do&token',
            views: {
                'menuContent': {
                    templateUrl: 'route/month/month.html',
                    controller: 'monthCtrl'
                }
            },
            resolve: {
                'setToken': function (setToken,$stateParams,$location){
                     setToken.set($stateParams.token);

                    delete $location.$$search.token;
                    delete $location.$$search.do;

                    $location.path("/app/month")
                }
            }

        });




    $ionicConfigProvider.views.transition('none');

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/month/');

        localStorageServiceProvider
            .setPrefix('w11k')
            .setStorageType('localStorage')


});

angular.module('w11kcal.app').constant('AppKey', '41485cd87d154168dd6db06cdd3ffd69');



angular.module('w11kcal.app').controller('sidebarCtrl', function ( /*ngInject*/ $scope, demoSaveService) {
console.log(demoSaveService.print());
//    $scope.name = demoSaveService.print()[0].data["fullName"];
});



