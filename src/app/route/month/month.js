'use strict';


angular.module('w11kcal.app.month', []);
angular.module('w11kcal.app.month').config(/*ngInject*/ function ($stateProvider) {
    console.log("w11kcal.app.month.config läuft");

    $stateProvider
        .state('app.month', {
            url: '/month/{date}',
            views: {
                'menuContent': {
                    templateUrl: 'route/month/month.html',
                    controller: 'monthCtrl'
                }
            },
            resolve: {
                'asInitService':function (initService) {
                    return initService.init();
                }
            }
        });
});







angular.module('w11kcal.app.month').run(function () {
});

angular.module('w11kcal.app.month').controller('monthCtrl', /*ngInject*/ function (initService, $timeout, $interval, $ionicScrollDelegate,archiveCard, $scope, changeDate,Notification, saveService,$window,$stateParams, $location,buildCalService,$rootScope) {


    /**
     * Part 1: config
     */
    $scope.view = 'month';

    $scope.$on('changeToWeek', function () {
        $scope.view = 'week';
    });

    $scope.$on('changeToMonth', function () {
        $scope.view = 'month';
    });

    var today, month, year, targetDate;

    if(saveService.print()) {
        $scope.login = true;
    }


    // set transmitted month
    var setDate = $stateParams.date.split('-', 2);
    today = new Date(setDate[0],(setDate[1]-1), 1);

    if(setDate[1] === undefined) {
        // wrong date set in url, redirecting to today
        today = new Date();
        $location.path("/app/month/"+today.getFullYear()+"-"+(today.getMonth()+1)).replace();
    }


    var date = {};
    date.year = today.getFullYear();
    date.month = today.getMonth();

    $scope.date = {
        iso: today,
        monthName: moment.months()[date.month],
        month: date.month,
        year: date.year
    };



    /**
     * Part 2: Build
     */

        // top legende
    $scope.weekdays = [];
    for (var i = 0; i <= 6; i++) {
        var long =  moment().weekday(i).format("dddd");
        var short = moment().weekday(i).format("dd");
        $scope.weekdays[i] = [short, long];
    }
    // build the Cal
    $scope.days = buildCalService.build(date);




    // Build Filter
    $scope.boards = [];
    _.forEach(saveService.print()[2].data, function (board) {
        $scope.boards.push({
            name: board.name,
            id: board.id,
            ticked: true,
            color: board.prefs.backgroundColor
        });
    });
    $scope.multipleDemo = {};
    $scope.multipleDemo.selectedBoards = $scope.boards;
    $scope.activeBoard = function (card) {
        return _.find($scope.multipleDemo.selectedBoards, { 'id': card.idBoard});
    };



    /**
     * Part 3: Options:
     */
    $scope.loading = false;
    $scope.refresh = function () {
        if($scope.loading === false) {
            $scope.loading = true;
            initService.init(1)
                .then(function () {
                    $scope.loading = false;
                    $scope.days = buildCalService.build(date);
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }
    };




    $scope.logout = function () {
        saveService.remove();
        $scope.login = false;
        console.log(saveService.print());
        $window.location.reload();
    };





    $scope.move = function (steps) {
        console.log($rootScope.weekPosition);
        year = date.year;
        month = (date.month + steps);
        if(month >= 12) {
            month = 0;
            year++;
        } else if ( month <= -1) {
            month = 11;
            year--;
        }
        $rootScope.$broadcast('lastViewChangedTo', {year: year, month: month});
        $location.path("/app/month/"+year+"-"+(month+1));
    };





    // Drag 'n Drop
    $scope.onDragSuccess = function (data, evt, from) {
        console.log($scope.days);
        console.log(from);
        var index = $scope.days[from].cards.indexOf(data);
        if (index > -1) {
            $scope.days[from].cards.splice(index, 1);
        }
    };

    $scope.onDropComplete = function (data, evt, target,targetDate) {

        console.log("Target:"+target);
        data.waiting = true;
        if(typeof  $scope.days[target].cards === 'undefined') {
            $scope.days[target].cards = [];
            $scope.days[target].cards[0] = data;

        } else {
            var index = $scope.days[target].cards.indexOf(data);
            if (index === -1) {
                $scope.days[target].cards.push(data);
            }
        }
        targetDate.setHours(12, 0, 0);
        changeDate.async(data.id, targetDate).then(function () {
                console.log("succes");
                data.waiting = false;
                data.due = targetDate;
                data.dueDate = targetDate;
            },
            function () {
                console.log("err");
            });
    };





    $scope.changeMonth = function (data, param, month) {
        if(data.due.getMonth() !== month)      {
            targetDate = moment(data.dueDate).add(0, 'month').toISOString();
            targetDate =new Date(targetDate);
            targetDate = new Date(targetDate.setDate(1));
        }else {
            targetDate = moment(data.dueDate).add(1, 'month').toISOString();
            targetDate = new Date(targetDate);
            targetDate = new Date(targetDate.setDate(1));
        }

        changeDate.async(data.id, targetDate).then(function () {
                console.log("succes");
            },
            function () {
                console.log("err");
            });
    };



    $scope.archiveCard = function (data) {
        var id = data.id;
        archiveCard.async(id).then(function () {
            var message = '<span ng-controller="archiveCtrl"><br>Archived </span>';
            Notification.warning({message: message});
        });
    };




    $scope.showDetail = false;
    $scope.detail = function (id) {
        $scope.showDetail = true;
        $ionicScrollDelegate.scrollBottom();
        $scope.singleCard =_.find(saveService.print()[1].data, { 'id': id});
    };



    $scope.closeDetail = function () {
        $scope.showDetail = false;
    };


    $interval(function () {
        if($scope.doRefresh) {
            $scope.refresh();
        }
    }, 30000, 0, false);
















    /**
     * Week
     */



    $scope.weekFilter = function (day, index) {
        return index < $rootScope.weekPosition+7 && index >= $rootScope.weekPosition ;
    };

    $scope.moveWeek = function (steps) {
        if($rootScope.weekPosition === 0 && steps < 0) {
            $rootScope.weekPosition = 28;
            $scope.move(-1);
        }
        else if ($rootScope.weekPosition === 28 && steps > 0) {
            $rootScope.weekPosition = 0;
            $scope.move(1);
        }
        else {
            $rootScope.weekPosition = $rootScope.weekPosition + steps*7;
        }
    };
});







angular.module('w11kcal.app.month').filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function (item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            out = items;
        }

        return out;
    };
});

