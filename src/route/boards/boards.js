'use strict';
var boards = angular.module('trelloCal.boards', []);
boards.config(/*ngInject*/ function () {

});

boards.controller('boardsCtrl', function($scope,asInitService,localStorageService,$window,getExistingBoardColors,initService) {

    if (localStorageService.get('observerMode')===true)
    {
        $scope.boards = (initService.print()[2]);
    }
    else
    {
        $scope.boards = initService.print()[2].data;
    }



    // Init Werte von Datenbank in LocalStorage aktualisieren falls nicht verfügbar
    for (var board in $scope.boards)
    {
        $scope.boards[board].prefs.backgroundColor=localStorageService.get($scope.boards[board].id);
        var y='{"id":"'+board+'","color":"#3F51B5","colorName":"Indigo","name":"'+$scope.boards[board].name+'","enabled":true}';
        var obj=JSON.parse(y);

        if(!getExistingBoardColors){
            getExistingBoardColors=[obj];
            localStorageService.set('Boards',getExistingBoardColors);
        } // neuen Array in LocalStorage
        else{
            var exists=false;
            for (var i=0;i<getExistingBoardColors.length;i++){
                if(board===getExistingBoardColors[i].id){exists=true;}
            }
            if (exists===false){getExistingBoardColors.push(obj);localStorageService.set('Boards',getExistingBoardColors);}
        } //dem vorhandenen Array Objekte hinzufügen
    }

    $scope.ExistingBoards=getExistingBoardColors;
    $scope.nothing=function(){console.log('click');};

    $scope.colors=[
        {name: 'Red',color:'#F44336'},
        {name: 'Pink',color:'#E91E63'},
        {name: 'Purple',color:'#9C27B0'},
        {name: 'Deep Purple',color:'#673AB7'},
        {name: 'Indigo',color:'#3F51B5'},
        {name: 'Blue',color:'#2196F3'},
        {name: 'Light Blue',color:'#00BCD4'},
        {name: 'Teal',color:'#009688'},
        {name: 'Green',color:'#43A047'},
        {name: 'Light Green',color:'#689F38'},
        {name: 'Lime',color:'#827717'},
        {name: 'Orange',color:'#EF6C00'},
        {name: 'Deep Orange',color:'#FF5722'},
        {name: 'Brown',color:'#795548'},
        {name: 'Grey',color:'#757575'},
        {name: 'Blue Grey',color:'#607D8B'},
    ];


        $scope.announceClick = function(index,id) {

            var y='{"id":"'+id+'","color":"'+$scope.colors[index].color+'","colorName":"'+$scope.colors[index].name+'","name":"'+$scope.boards[id].name+'","enabled":true}';
            var obj=JSON.parse(y);
            if(!getExistingBoardColors)
            {getExistingBoardColors=[obj];localStorageService.set('Boards',getExistingBoardColors);}
            else{
                var exists=false;
                for (var i=0;i<getExistingBoardColors.length;i++){

                    if(id===getExistingBoardColors[i].id){
                        getExistingBoardColors[i].color=$scope.colors[index].color;
                        localStorageService.set('Boards',getExistingBoardColors);
                        exists=true;
                    }
                }
                if (exists===false){getExistingBoardColors.push(obj);localStorageService.set('Boards',getExistingBoardColors);}

            }
            //localStorageService.set(id,$scope.colors[index].color);


            initService.updateColor(id);


      };

    $scope.change=function(index,state){
        getExistingBoardColors[index].enabled=state;
        localStorageService.set('Boards',getExistingBoardColors);

    };



});


