'use strict';

angular.module('starter', [
    'ionic',
    'starter.month',
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker',
    'xeditable',
    'ngDraggable',
    'angular-loading-bar',
    'ui-notification'
]);

angular.module('starter').run(function ($ionicPlatform, $window,editableOptions,  $rootScope, cfpLoadingBar) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'


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

angular.module('starter').config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        // setup an abstract state for the tabs directive
        .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'partial/sidemenu.html',
            controller:'sidebarCtrl'
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/month/');

});


angular.module('starter').controller('sidebarCtrl', function ($scope) {
    $scope.user = "Can Kattwinkel!";
});

angular.module('starter').controller('archiveCtrl', function ($scope) {
    $scope.click = function(){


    }
});





