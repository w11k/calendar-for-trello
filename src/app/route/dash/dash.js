'use strict';

angular.module('starter.dash', []);

angular.module('starter').config(function ($stateProvider) {

  $stateProvider
    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'route/dash/dash.html',
          controller: 'DashCtrl'
        }
      }
    });

});

angular.module('starter.dash').controller('DashCtrl', function () {
});
