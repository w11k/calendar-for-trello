'use strict';
var boards = angular.module('trelloCal.boards', []);
boards.config(/*ngInject*/ function () {

});

boards.controller('boardsCtrl', function ($scope, webStorage) {
    var storage = webStorage.get('TrelloCalendarStorage');

    function updateScope() {
        webStorage.set('TrelloCalendarStorage', storage);
        $scope.boards = [];
        for (var x in storage.boards) {
            $scope.boards.push(storage.boards[x]);
        }
        $scope.boards.sort(function (a, b) {
            var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
            if (nameA < nameB) //sort string ascending
            {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0; //default return value (no sorting)
        });
        $scope.colorizeCards = storage.me.colorizeCards;
        $scope.colors = [];
        for (var y in storage.colors) {
            $scope.colors.push(storage.colors[y]);
        }

    }

    $scope.boards = [];
    $scope.colors = [];
    $scope.colorizeCards = webStorage.get('TrelloCalendarStorage').me.colorizeCards;
    updateScope();



    $scope.changeColorize = function (x) {
        storage.me.colorizeCards = x;
        updateScope();
    };


    $scope.announceClick = function (index, id) {
        storage.boards[id].prefs.backgroundColor = $scope.colors[index].color;
        storage.boards[id].prefs.background = $scope.colors[index].id;
        updateScope();
    };

    $scope.change = function (index, state) {
        $scope.colors[index].enabled = state;
        storage.boards[$scope.boards[index].id].enabled = state;
        updateScope();
    };


});

