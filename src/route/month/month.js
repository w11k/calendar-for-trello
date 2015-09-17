'use strict';
var month = angular.module('trelloCal.month', []);
month.config(/*ngInject*/ function () {

});

month.controller('monthCtrl', function(asInitService, $timeout, $interval,
                                       archiveCard, $scope, buildCalService, changeDate,$window,
                                       $stateParams, $location,$mdDialog, localStorageService,orderByFilter,
                                       ngProgress,initService, $q,getExistingBoardColors) {


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
            {name: 'Blue',color:'#0079BF'},
            {name: 'Yellow',color:'#D29034'},
            {name: 'Green',color:'#519839'},
            {name: 'Red',color:'#B04632'},
            {name: 'Purple',color:'#89609E'},
            {name: 'Pink',color:'#CD5A91'},
            {name: 'Light Green',color:'#00BCD4'},
            {name: 'Sky',color:'#00AECC'},
            {name: 'Grey',color:'#838C91'}
        ];


        // Init Werte von Datenbank in LocalStorage aktualisieren falls nicht verfügbar
        for (var board in $scope.boards)
        {
            var ColorIndex=4;
            switch ($scope.boards[board].prefs.backgroundColor) {
                case '#0079BF':
                    ColorIndex =0 ;
                    break;
                case '#D29034':
                    ColorIndex =1 ;
                    break;
                case '#519839':
                    ColorIndex=2;
                    break;
                case '#B04632':
                    ColorIndex=3;
                    break;
                case '#89609E':
                    ColorIndex =4;
                    break;
                case '#CD5A91':
                    ColorIndex=5;
                    break;
                case '#4BBF6B':
                    ColorIndex=6;
                    break;
                case '#00AECC':
                    ColorIndex=7;
                    break;
                case '#838C91':
                    ColorIndex=8;


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

        var routine = function (date, defer) {
        $scope.days = buildCalService.build(date).days;
        $scope.date = {
            iso: new Date(year,month),
            monthName: moment.months()[date.month],
            month: date.month,
            year: date.year
        };


        $scope.isToday = (date.year === today.year && date.month === today.month);


        $scope.searchText = null;
        $scope.querySearch = querySearch;
        $scope.boards = buildCalService.boards();
        localStorage.removeItem('selectedBoards');
        $scope.resetBoards();

        $scope.$watch('selectedBoards', function () {
            $scope.resetBtn = ($scope.selectedBoards.length !== $scope.boards.length);
        }, true);


        if(defer) {
            defer.resolve();
        }

    };



    var month, year,  today;

    var date = {};
    date.year = new Date().getFullYear();
    date.month = new Date().getMonth();
    today = {};
    today.year = new Date().getFullYear();
    today.month = new Date().getMonth();


    $scope.isToday = (date.year === today.year && date.month === today.month);

    $scope.date = {
        iso: new Date(),
        monthName: moment.months()[date.month],
        month: date.month,
        year: date.year
    };

    $scope.toToday = function () {
        date = today;
        routine(date);
    };


        // top legende
    $scope.weekdays = [];
    for (var i = 0; i <= 6; i++) {
        var long =  moment().weekday(i).format('dddd');
        var short = moment().weekday(i).format('dd');
        $scope.weekdays[i] = [short, long];
    }







    $scope.resetBoards = function () {
        var temp=[];
        $scope.boards.forEach(function (item) {
            for (var x in localStorageService.get('Boards'))
            {
                if (localStorageService.get('Boards')[x].id===item.id && localStorageService.get('Boards')[x].enabled===true)
                {
                    temp.push(item);
                }
            }
        });
        localStorage.removeItem('selectedBoards');
        localStorageService.set('selectedBoards',temp);
        $scope.selectedBoards=localStorageService.get('selectedBoards');

    };


    /**
     * Search for boards.
     */
    function querySearch (query) {
        var results = query ? $scope.boards.filter(createFilterFor(query)) : [];
        return results;
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(board) {
            return (board._lowername.indexOf(lowercaseQuery) === 0);
        };

    }




    routine(date);
    $scope.$watch('days'   , function () {
        _.forEach($scope.days, function (day) {
            day.cards = orderByFilter(day.cards, ['badges.due', 'name']);
        });
    }, true);







    $scope.refresh = function () {
        ngProgress.start();
        initService.refresh().then(function () {
                routine($scope.date);
                ngProgress.complete();
            }
        );
    };







    $scope.click = function (shortUrl) {
        $window.open(shortUrl);
    };

    $scope.move = function (steps) {
        ngProgress.start();


        var defer = $q.defer();

        year = date.year;
        month = (date.month + steps);
        if(month >= 12) {
            month = 0;
            year++;
        } else if ( month <= -1) {
            month = 11;
            year--;
        }

        date = {year: year, month:month};

        routine(date, defer);


        defer.promise.then( function () {
            ngProgress.complete();
        });

    };


    $scope.sortableOptions = {
        receive: function (e, ui) {
            var id = ui.item[0].firstElementChild.id.split('-')[0];
            console.log(ui.item[0].firstElementChild);
            ngProgress.start();
            var str = e.target.id+ui.item[0].firstElementChild.id.split('-')[1];
            var newStr = [];
            console.log(str);

            angular.forEach(str.split(','), function(value) {
                newStr.push(parseInt(value));
            });
            if(!newStr[3]){newStr[3]=12;newStr.push(0);newStr.push(0);}
            var targetDate = new Date(newStr[0],newStr[1]-1,newStr[2],newStr[3],newStr[4]);

            changeDate.async(id, targetDate).then(function () {
                    initService.updateDate(id, targetDate);
                    ngProgress.complete();
                },
                function () {
                    var dialog = function () {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .parent(angular.element(document.body))
                                .title('Oops, something went wrong.')
                                .content('please check your connection and reload this page')
                                .ariaLabel('Connection Error')
                                .ok('reload')
                            //  .targetEvent(ev)
                        ).then(function () {
                                changeDate.async(ui.item[0].firstElementChild.id.split('-')[0], targetDate).then(function () {
                                    // user is only, successfull
                                }, function () {
                                    dialog();
                                });
                            });
                    };
                    dialog();
                });
        },
        placeholder: 'card',
        connectWith: '.dayCards'

    };
    $scope.filter = localStorageService.get('filter') === false;
    $scope.color = localStorageService.get('boardColors');
    $scope.archiveCard = function (data) {
        var id = data.id;
        archiveCard.async(id).then(function () {
            //success
        },function () {
            //error
        });
    };
    $scope.activeBoard = function (card) {
        return _.find($scope.selectedBoards, { 'id': card.idBoard});
//        return _.find(localStorageService.get('selectedBoards', { 'id': card.idBoard}));

    };


    if(localStorageService.get('refresh')) {
        $interval(function () {
            $scope.refresh();
        }, 30000, 0, false);
    }



    $scope.$on('rebuild', function() {
        routine($scope.date);
    });


});
