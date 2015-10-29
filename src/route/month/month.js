'use strict';
var month = angular.module('trelloCal.month', []);
month.config(/*ngInject*/ function (toastrConfig) {
    angular.extend(toastrConfig, {
        autoDismiss: false,
        containerId: 'toast-container',
        maxOpened: 1,
        newestOnTop: true,
        positionClass: 'toast-bottom-left',
        preventDuplicates: false,
        preventOpenDuplicates: true,
        target: 'body',
        toastClass: 'toast'
    });
});

month.controller('monthCtrl', function ($timeout, $interval,toastr,
                                        archiveCard, $scope, buildCalService, changeDate, $window,
                                        $stateParams, $location, $mdDialog, localStorageService, orderByFilter,
                                        ngProgress, initService, $q, getExistingBoardColors, $rootScope, webStorage) {


    $scope.refresh = function () {
        if ($scope.offline !== true) {
            ngProgress.start();
            initService.refresh().then(function () {
                    $rootScope.$broadcast('rebuild');
                    ngProgress.complete();
                }
            );
        }
        else {
            console.log('offline');
        }


    };
    $scope.reloadView = function () {
        ngProgress.start();
        $rootScope.$broadcast('rebuild');
        $scope.$apply();
        ngProgress.complete();
    };

    var routine = function (date, defer) {
        initService.refreshColors();
        buildCalService.refresh();
        $scope.days = [];
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
        console.log($scope.days);

    };
    var month, year, today;

    var date = {};
    date.year = new Date().getFullYear();
    date.month = new Date().getMonth();
    today = {};
    today.year = new Date().getFullYear();
    today.month = new Date().getMonth();
    var tempPost = [];

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

            tempPost.push([id, targetDate]);
            updateChangeArray();

        },
        revert: true,
        placeholder: 'card',
        connectWith: '.dayCards',
        over: function (event, ui) {
            var element = document.getElementById(event.target.id);
            if (event.target.id !== ui.item[0].parentElement.id) {
                var children = element.children;
                _.forEach(children, function (child) {
                    child.style.transform = 'scale(0.8)';
                });
            }
            element.style.borderColor = '#42548E';
            element.style.borderStyle = 'dashed';
            element.style.borderWidth = '3px';

        },
        out: function (event) {
            var element = document.getElementById(event.target.id);
            element.style.borderStyle = 'none';
            var children = element.children;
            _.forEach(children, function (child) {
                child.style.transform = 'scale(1)';
            });
        }
    };

    function updateChangeArray() {
        var promises = [];
        _.forEach(tempPost, function (change) {
            promises.push(changeDate.async(change[0], change[1]));
        });
        $q.all(promises).then(function (responses) {
            _.forEach(responses, function (change, index) {
                tempPost.splice(index, 1);

            });
            $scope.refresh();
            ngProgress.complete();
            toastr.success('Successfully changed!');
        }, function () {
            toastr.warning('Your changes have been saved!');
        });
    }

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

    $scope.$on('updateChange', updateChangeArray);
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
                $scope.reloadView();
            }
        }
        else {
            if (_.isEmpty(temp.cards.my)) {
                $scope.reloadView();
            }
        }

        $scope.reloadView();
    };

});
