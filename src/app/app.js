'use strict';

angular.module('w11kcal.app', [
    'ionic',
    'w11kcal.app.month',
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker',
    'xeditable',
    'ngDraggable',
    'angular-loading-bar',
    'ui-notification'
    //,
    //'w11k-dropdownToggle',
    //'w11k-select'
]);

angular.module('w11kcal.app').run( /*ngInject*/ function ($ionicPlatform, $window,editableOptions,  $rootScope, cfpLoadingBar) {
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


    console.log("w11kcal.app.run läuft.");

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

angular.module('w11kcal.app').config(/*ngInject*/ function ($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
    $stateProvider
        // setup an abstract state for the tabs directive
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'partial/sidemenu.html',
            controller:'sidebarCtrl'
        });
    $ionicConfigProvider.views.transition('none');





    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/month/');

});


angular.module('w11kcal.app').controller('sidebarCtrl', function ( /*ngInject*/ $scope) {
    $scope.user = "";
    console.log("w11kcal.app.sidebarCtrl läuft.");
});



