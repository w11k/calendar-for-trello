'use strict';

angular.module('starter.friends', []);

angular.module('starter.friends').config(function ($stateProvider) {

  $stateProvider
    .state('tab.friends', {
      url: '/friends',
      views: {
        'tab-friends': {
          templateUrl: 'route/friends/friends.html',
          controller: 'FriendsCtrl'
        }
      }
    })
    .state('tab.friend-detail', {
      url: '/friend/:friendId',
      views: {
        'tab-friends': {
          templateUrl: 'route/friends/friend-detail.html',
          controller: 'FriendDetailCtrl'
        }
      }
    });
});

angular.module('starter.friends').factory('Friends', function () {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];

  return {
    all: function () {
      return friends;
    },
    get: function (friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  };
});

angular.module('starter.friends').controller('FriendsCtrl', function ($scope, Friends) {
  $scope.friends = Friends.all();
});

angular.module('starter.friends').controller('FriendDetailCtrl', function ($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
});
