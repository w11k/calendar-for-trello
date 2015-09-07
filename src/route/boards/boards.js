'use strict';
var boards = angular.module('trelloCal.boards', []);
boards.config(/*ngInject*/ function () {

});

//function pushIfNotExist(array,item){
//
//    var l=array.length;
//    for (var i=0;1<=l;i++)
//    {
//        if (array[i]===item){return null;}
//
//    }
//    array.push(item);
//    return null;
//}

boards.controller('boardsCtrl', function($scope,BoardsResolve) {

    console.log(BoardsResolve);

});
