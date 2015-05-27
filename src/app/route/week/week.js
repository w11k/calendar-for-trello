'use strict';
var month = angular.module('trelloCal.week', []);
month.config(/*ngInject*/ function () {

});

month.controller('weekCtrl', function(initService, $timeout, $interval,
                                       archiveCard, $scope, buildCalService, changeDate,$window,
                                       $stateParams, $location,$mdDialog,weekService,localStorageService,orderByFilter, ngProgress) {



    var routine = function (date, reload) {
        $scope.allBoards = [];
        $scope.date = {};
        if(!date){
            // init
            $scope.date.year =  parseInt(new Date().getFullYear());
            $scope.date.kw =  parseInt(moment().format('W'));
        } else {
            $scope.date.year = parseInt(date.year);
            $scope.date.kw = parseInt(date.kw);
        }




        $scope.date.amountOfKW = {};
        $scope.date.amountOfKW.prev = weeksOfYear($scope.date.year-1);
        $scope.date.amountOfKW.this = weeksOfYear($scope.date.year);
        $scope.date.amountOfKW.next = weeksOfYear($scope.date.year+1);
        $scope.allDays = weekService.buildYear($scope.date.year, reload);
        $scope.days = [];
        $scope.allDays.forEach(function (entry) {
            if(entry.kw === $scope.date.kw) {
                $scope.days.push(entry);

                if(entry.cards === undefined) {
                    entry.cards = [];
                }

                _.forEach(entry.cards, function (card) {
                    var board = {
                        name: card.boardName,
                        _lowername: card.boardName.toLowerCase(),
                        id: card.idBoard,
                        image: '#',
                        email: '#',
                        color: card.color
                    };
                    $scope.allBoards.push(board);
                });
            }
        });

        // Setup Filter
       $scope.allBoards = _.uniq($scope.allBoards, function (item) {
            return 'id:' + item.id + 'name:' + item.name;
        });






        $scope.boards = [];


        ///**
        // *  has to be trough a for each loop ..
        // */
        $scope.resetBoards = function () {
            $scope.boards = [];
            $scope.allBoards.forEach(function (item) {
                $scope.boards.push(item);
            });
        };

        $scope.resetBoards();

        $scope.filterSelected = true;

        $scope.activeBoard = function (card) {
            return _.find($scope.boards, { 'id': card.idBoard});
        };


        $scope.isToday = (
            $scope.date.year === parseInt(moment().format('YYYYY')) && $scope.date.kw === parseInt(moment().format('W'))
        );
    };




    var weeksOfYear = function (year) {
        var date = new Date(year, 11 , 31);
        var workDate = new Date(date.getTime() + (3-((date.getDay()+6) % 7)) * 86400000);
        var cwYear = workDate.getFullYear();
        var doCW = new Date(new Date(cwYear,0,4).getTime() + (3-((new Date(cwYear,0,4).getDay()+6) % 7)) * 86400000);
        var kw = Math.floor(1.5+(workDate.getTime()-doCW.getTime())/86400000/7);
        if(kw===1){
            return 52;
        }
        return kw;
    };



    $scope.toToday = function () {
        routine({
            year: parseInt(moment().format('YYYY')),
            kw:parseInt(moment().format('W'))
        }, false);

    };


    $scope.weekdays = [];
    for (var i = 0; i <= 6; i++) {
        var long =  moment().weekday(i).format('dddd');
        var short = moment().weekday(i).format('dd');
        $scope.weekdays[i] = [short, long];
    }




    routine($scope.date, false);

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
        if($scope.date.kw === 1 && steps === -1 ){
            $scope.date.year--;
            $scope.date.kw = $scope.date.amountOfKW.prev;
            routine($scope.date, false);
            return;
        }
        if($scope.date.kw >= $scope.date.amountOfKW.this && steps === 1){
            $scope.date.year++;
            $scope.date.kw = 1;
            routine($scope.date, false);
            return;
        }
        $scope.date.kw = $scope.date.kw+steps;
        routine($scope.date,false);
    };








    $scope.sortableOptions = {
        receive: function (e, ui) {
            var id = ui.item[0].firstElementChild.id.split('-')[0];
            var targetDate = new Date(e.target.id+' '+ui.item[0].firstElementChild.id.split('-')[1]);
            ngProgress.start();
            changeDate.async(id, targetDate).then(function () {
                    initService.updateDate(id, targetDate);
                    ngProgress.complete();
                },
                function () {
                    /**
                     * ToDo:
                     * move card back
                     */
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




    if(localStorageService.get('refresh')) {
        $interval(function () {
            $scope.refresh();
    }, 30000, 0, false);
    }




    /**
     * Search for boards.
     */
    function querySearch (query) {
        var results = query ?
            $scope.allBoards.filter(createFilterFor(query)) : [];
        return results;
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(contact) {
            return (contact._lowername.indexOf(lowercaseQuery) !== -1);
        };

    }

    $scope.querySearch = querySearch;



    $scope.$on('rebuild', function() {
        routine($scope.date);
    });

});
