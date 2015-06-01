'use strict';
var stream = angular.module('trelloCal.stream', []);
stream.config(/*ngInject*/ function () {

});

stream.controller('streamCtrl', function($scope,init) {
    $scope.data = init;
});
