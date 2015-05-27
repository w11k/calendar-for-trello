'use strict';
var month = angular.module('trelloCal.month', []);
month.config(/*ngInject*/ function ($stateProvider) {
    $stateProvider
    .state('month', {
        url: '/month',
        views: {
            'header': {
                abstract: true,
                templateUrl: 'partials/header.html',
                controller: 'headerCtrl'

            },
            'sidebar':{
                abstract: true,
                templateUrl: 'partials/sidebar.html',
                controller: 'headerCtrl'
            },

            'content': {
                templateUrl: 'route/month/month.html',
                controller: 'monthCtrl',
                data: {
                    pageTitle: 'Month View'
                }
            }
        }
        ,
        resolve: {
            'asInitService':function (initService) {
                return initService.init();
            }
        }
    });


});

month.controller('monthCtrl', function(asInitService, $timeout, $interval,
                                       archiveCard, $scope, buildCalService, changeDate,$window,
                                       $stateParams, $location,$mdDialog, localStorageService,orderByFilter,
                                       ngProgress,initService) {



    var boards;

    var routine = function (date) {
        $scope.days = buildCalService.build(date).days;

        $scope.date = {
            iso: new Date(year,month),
            monthName: moment.months()[date.month],
            month: date.month,
            year: date.year
        };


        $scope.isToday = (date.year === today.year && date.month === today.month);
        boards = buildCalService.boards();
        $scope.allBoards = [];
        _.forEach(boards, function (board) {
            $scope.allBoards.push(board);
        });
        $scope.resetBoards();

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


    $scope.days = buildCalService.build(date).days;

    $scope.$watch('days'   , function () {
        _.forEach($scope.days, function (day) {
            day.cards = orderByFilter(day.cards, ['badges.due', 'name']);
        });
    }, true);



    $scope.$watch('boards', function () {
       $scope.resetBtn = ($scope.boards.length !== $scope.allBoards.length);
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

        routine(date);

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

    boards = buildCalService.boards();


    $scope.querySearch = querySearch;
    $scope.allBoards = [];
    _.forEach(boards, function (board) {
        $scope.allBoards.push(board);
    });


    $scope.boards = [];


    /**
     *  has to be trough a for each loop ..
     */
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


    if(localStorageService.get('refresh')) {
        $interval(function () {
            $scope.refresh();
        }, 30000, 0, false);
    }



    $scope.$on('rebuild', function() {
        routine($scope.date);
    });


});
