'use strict';

angular.module('starter.account', []);

angular.module('starter.account').config(function ($stateProvider) {

  $stateProvider
    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'route/account/account.html',
          controller: 'AccountCtrl'
        }
      }
    });

});

angular.module('starter.account').controller('AccountCtrl', function () {
});
