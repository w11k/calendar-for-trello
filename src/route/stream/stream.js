'use strict';
var stream = angular.module('trelloCal.stream', []);
stream.config(/*ngInject*/ function () {

});
/* jshint ignore:start */

stream.controller('streamCtrl', function($scope,init,$http ) {
    $scope.data = init;


    $scope.causeError = function (maxMarker) {


        xmarkerx = ymarkery;

        ymarkery = zmaerkerz;

        zmarker1z = maxMarker;


    };


    $scope.causeXhrError = function() {
        $http.get('/someUrl').
            success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });

    };

});
/* jshint ignore:end */
