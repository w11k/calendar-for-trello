'use strict';


angular.module('w11kcal.app', [
    'ionic',
    'w11kcal.app.month',
    'w11kcal.app.week',
    'w11kcal.app.settings',
    'ngSanitize',
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker',
    'ngDraggable',
    'angular-loading-bar',
    'ui-notification',
    'LocalStorageModule',
    'ui.select'
]);

angular.module('w11kcal.app').constant('AppKey', '41485cd87d154168dd6db06cdd3ffd69');
angular.module('w11kcal.app').constant('baseUrl', 'http://192.168.1.170:9000');



angular.module('w11kcal.app').run( /*ngInject*/ function ($ionicPlatform, $window,  $rootScope, cfpLoadingBar,localStorageService) {


    $rootScope.doRefresh = localStorageService.get("refresh") === "true";
    $rootScope.boardColors = localStorageService.get("boardColors") === "true";
    $rootScope.week =  localStorageService.get("startWithWeek") === "true";


    $rootScope.$on('settings-changed', function () {
        $rootScope.doRefresh = localStorageService.get("refresh") === "true";
        $rootScope.boardColors = localStorageService.get("boardColors") === "true";

    });


    $ionicPlatform.ready(function () {
        // Hide the accessory bar by defflt (remove this to show the accessory bar above the keyboard
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
        function (){
            cfpLoadingBar.start();

        });

    $rootScope
        .$on('$stateChangeSuccess',
        function () { // Options: event, toState, toParams, fromState, fromParams
            cfpLoadingBar.complete();
        });




});

angular.module('w11kcal.app').config(/*ngInject*/ function ($stateProvider, $urlRouterProvider,$ionicConfigProvider,localStorageServiceProvider, uiSelectConfig) {
    moment.locale('de');
        uiSelectConfig.appendToBody = true;


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

                    $location.path("/app/month/"+new Date().getFullYear()+"-"+(new Date().getMonth()+1));
                }
            }
        });

    $ionicConfigProvider.views.transition('none');
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise(function ($injector) {
        var $state = $injector.get('$state');
        $state.go('app.month', {date: new Date().getFullYear()+"-"+(new Date().getMonth()+1)});
    });
        localStorageServiceProvider
            .setPrefix('w11k')
            .setStorageType('localStorage');
});




angular.module('w11kcal.app').controller('sidebarCtrl', function ( /*ngInject*/ $state, buildCalService, $scope, saveService,$rootScope) {

    if(saveService.print()){
        $scope.name = saveService.print()[0].data.fullName;
    } else {
        $scope.name = "- please login to start";
    }


    $scope.week = function (){

        $rootScope.week = true;
        $state.go("app.month");
    };


    $scope.toCal = function () {
        $rootScope.week = false;
        $state.go("app.month");
    };

    $rootScope.weekPosition = 0;

});


Date.prototype.getWeekNumber = function () {

    var d = new Date(+this);
    // use this line to mock date
   // var d = new Date(2015,2,20);
    d.setHours(0,0,0);
    d.setDate(d.getDate()+4-(d.getDay()||7));
    // D ist jetzt der donnerstag Tag um den herum gebaut werden muss!
    return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);

};




