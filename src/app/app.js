'use strict';

angular.module('starter', [
  'ionic',
  'starter.dash',
  'starter.friends',
  'starter.account',
  'ui.bootstrap'
]);

angular.module('starter').run(function ($ionicPlatform, $window) {
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
});

angular.module('starter').config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider
    // setup an abstract state for the tabs directive
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'partial/sidemenu.html'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
