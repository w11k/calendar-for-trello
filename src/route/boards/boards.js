'use strict';
var boards = angular.module('trelloCal.boards', []);
boards.config(/*ngInject*/ function () {

});

boards.controller('boardsCtrl', function($scope,asInitService,localStorageService,$window,getExistingBoardColors,initService) {
//    updateBoardsService.update();
    function init(){
    if (localStorageService.get('observerMode')===true)
        {
            $scope.boards = (initService.print()[2]);
        }
        else
        {
            $scope.boards = initService.print()[2].data;
        }
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


        // Init Werte von Datenbank in LocalStorage aktualisieren falls nicht verfügbar
        for (var board in $scope.boards)
        {
            var ColorIndex=4;
            switch ($scope.boards[board].prefs.backgroundColor) {
                case '#0079BF':
                    ColorIndex =4 ;
                    break;
                case '#D29034':
                    ColorIndex =11 ;
                    break;
                case '#519839':
                    ColorIndex=7;
                    break;
                case '#B04632':
                    ColorIndex=0;
                    break;
                case '#89609E':
                    ColorIndex =3;
                    break;
                case '#CD5A91':
                    ColorIndex=1;
                    break;
                case '#4BBF6B':
                    ColorIndex=9;
                    break;
                case '#00AECC':
                    ColorIndex=6;
                    break;
                case '#838C91':
                    ColorIndex=14;


            }

    //        $scope.boards[board].prefs.backgroundColor=localStorageService.get($scope.boards[board].id);
            var y='{"id":"'+board+'","color":"'+$scope.colors[ColorIndex].color+'","colorName":"'+$scope.colors[ColorIndex].name+'","name":"'+$scope.boards[board].name+'","enabled":true}';
            var obj=JSON.parse(y);
            if(!getExistingBoardColors){
                getExistingBoardColors=[obj];
                localStorageService.set('Boards',[obj]);
            } // neuen Array in LocalStorage
            else{
                var exists=false;
                for (var i=0;i<getExistingBoardColors.length;i++){

                    if(board===getExistingBoardColors[i].id)
                    {
                        exists=true;
                        if($scope.boards[board].closed===true)
                        {
                            getExistingBoardColors.splice(i, 1);
                        }
                    }
                }
                if (exists===false && $scope.boards[board].closed===false){

                    getExistingBoardColors.push(obj);
                    localStorageService.set('Boards',getExistingBoardColors);
                }
            } //dem vorhandenen Array Objekte hinzufügen
        }
    }
    init();
    $scope.colorizeCards=(localStorageService.get('boardColors')===true ||localStorageService.get('boardColors')===null);
    $scope.ExistingBoards=getExistingBoardColors;

    $scope.changeColorize=function(x){
        localStorageService.set('boardColors',x);
        $window.location.reload();
    };



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
                        getExistingBoardColors[i].colorName=$scope.colors[index].name;
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


