'use strict';
var month = angular.module('trelloCal.month', []);
month.config(/*ngInject*/ function () {

});

month.controller('monthCtrl', function ($timeout, $interval,
                                        archiveCard, $scope, buildCalService, changeDate, $window,
                                        $stateParams, $location, $mdDialog, localStorageService, orderByFilter,
                                        ngProgress, initService, $q, getExistingBoardColors, $rootScope, webStorage) {


    $scope.refresh = function () {
        ngProgress.start();
        initService.refresh().then(function () {
                routine($scope.date);
                $rootScope.$broadcast('rebuild');
                ngProgress.complete();
            }
        );
    };
    $scope.reloadView = function () {
        ngProgress.start();
        routine($scope.date);
        $rootScope.$broadcast('rebuild');
        ngProgress.complete();
    };

    var routine = function (date, defer) {
        $scope.days = buildCalService.build(date).days;
        $scope.date = {
            iso: new Date(year, month),
            monthName: moment.months()[date.month],
            month: date.month,
            year: date.year
        };
        $scope.isToday = (date.year === today.year && date.month === today.month);
        $scope.searchText = null;
        $scope.querySearch = querySearch;
        $scope.boards = buildCalService.boards();
        $scope.ExistingBoards = webStorage.get('TrelloCalendarStorage').boards;
        if (defer) {
            defer.resolve();

        }
    };

    var month, year, today;

    var date = {};
    date.year = new Date().getFullYear();
    date.month = new Date().getMonth();
    today = {};
    today.year = new Date().getFullYear();
    today.month = new Date().getMonth();
    $scope.sortableOptions = {
        receive: function (e, ui) {
            var id = ui.item[0].children[1].id.split('-')[0];
            ngProgress.start();
            var str = e.target.id + ui.item[0].children[1].id.split('-')[1];
            var newStr = [];

            angular.forEach(str.split(','), function (value) {
                newStr.push(parseInt(value));
            });
            if (!newStr[3]) {
                newStr[3] = 12;
                newStr.push(0);
                newStr.push(0);
            }
            var targetDate = new Date(newStr[0], newStr[1] - 1, newStr[2], newStr[3], newStr[4]);

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
    $scope.observe = localStorageService.get('observerMode') === true;
    $scope.ExistingBoards = webStorage.get('TrelloCalendarStorage').boards;
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

    /**top legende**/
    $scope.weekdays = [];
    for (var i = 0; i <= 6; i++) {
        var long = moment().weekday(i).format('dddd');
        var short = moment().weekday(i).format('dd');
        $scope.weekdays[i] = [short, long];
    }
    /**
     * Search for boards.
     */
    function querySearch(query) {
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

    $scope.$watch('days', function () {
        _.forEach($scope.days, function (day) {
            day.cards = orderByFilter(day.cards, ['due', 'name']);
        });
    }, true);

    $scope.click = function (shortUrl) {
        $window.open(shortUrl);
    };

    $scope.move = function (steps) {
        ngProgress.start();


        var defer = $q.defer();

        year = date.year;
        month = (date.month + steps);
        if (month >= 12) {
            month = 0;
            year++;
        } else if (month <= -1) {
            month = 11;
            year--;
        }

        date = {year: year, month: month};

        routine(date, defer);


        defer.promise.then(function () {

            ngProgress.complete();
        });

    };

    $scope.archiveCard = function (data) {
        var id = data.id;
        archiveCard.async(id).then(function () {
            //success
        }, function () {
            //error
        });
    };

    $scope.activeBoard = function (card) {
        return $scope.ExistingBoards[card.idBoard].enabled;

    };

    if (webStorage.get('TrelloCalendarStorage').me.autorefresh) {
        $interval(function () {
            $scope.refresh();
        }, 30000, 0, false);
    }

    $scope.$on('rebuild', function () {
        routine($scope.date);
    });

    $scope.filterClick = function (id) {
        var temp = _.find(webStorage.get('TrelloCalendarStorage').boards, {'id': id}).enabled;
        var Storage = webStorage.get('TrelloCalendarStorage');
        Storage.boards[id].enabled = !temp;
        webStorage.set('TrelloCalendarStorage', Storage);
        $scope.reloadView();
    };

    $scope.observeClick = function () {
        var temp = webStorage.get('TrelloCalendarStorage');
        temp.me.observer = !temp.me.observer;
        webStorage.set('TrelloCalendarStorage', temp);
        if (temp.me.observer === true) {
            if (_.isEmpty(temp.cards.all)) {
                $scope.refresh();
            }
        }
        else {
            if (_.isEmpty(temp.cards.my)) {
                $scope.refresh();
            }
        }

        $scope.reloadView();
    };

});
