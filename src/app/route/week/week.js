'use strict';
moment.locale('en');


angular.module('w11kcal.app.week', []);
angular.module('w11kcal.app.week').config(/*ngInject*/ function ($stateProvider) {
    $stateProvider
        .state('app.week', {
            url: '/week/:year/:kw',
            params: {
                year: new Date().getFullYear(),
                kw: new Date().getWeekNumber()
            },
            views: {
                'menuContent': {
                    templateUrl: 'route/week/week.html',
                    controller: 'weekCtrl'
                }
            },
            resolve: {
                'asInitService':function (initService) {
                    return initService.init();
                }
            }
        });
});







angular.module('w11kcal.app.week').run(function () {
});

angular.module('w11kcal.app.week').controller('weekCtrl', /*ngInject*/ function ($scope,saveService,$interval,$ionicScrollDelegate,
                                                                                 initService, buildCalService, $window, $stateParams,
                                                                                 $state, weekService,changeDate) {



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



    $scope.date = {};
    $scope.date.year = parseInt($stateParams.year);
    $scope.date.kw = parseInt($stateParams.kw);
    $scope.date.amountOfKW = {};
    $scope.date.amountOfKW.prev = weeksOfYear($scope.date.year-1);
    $scope.date.amountOfKW.this = weeksOfYear($scope.date.year);
    $scope.date.amountOfKW.next = weeksOfYear($scope.date.year+1);



    /**
     * Part 1: config
     */



    if(saveService.print()) {
        $scope.login = true;
    }










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



    var getDays = function( reload) {
        $scope.allDays = weekService.buildYear($scope.date.year, reload);


        $scope.days = [];
        $scope.allDays.forEach(function (entry) {
            if(entry.kw === $scope.date.kw) {
                $scope.days.push(entry);
            }
        });
    };

getDays(false);




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
                    getDays(true);
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
        if($scope.date.kw === 1 && steps === -1 ){
            $state.go("app.week", {year: $scope.date.year-1 , kw:($scope.date.amountOfKW.prev)});
            return;
        }
        if($scope.date.kw >= $scope.date.amountOfKW.this && steps === 1){
            $state.go("app.week", {year: $scope.date.year+1 , kw:(1)});
            return;
        }
        $state.go("app.week", {year: $scope.date.year , kw:($scope.date.kw+steps)});
     };









    // Drag 'n Drop
    $scope.onDragSuccess = function (data, evt, date) {
        var day = _.findIndex($scope.days, function(chr) {
            return chr.date === date;
        });
        var index = $scope.days[day].cards.indexOf(data);
        if (index > -1) {
            $scope.days[day].cards.splice(index, 1);
        }
    };

    $scope.onDropComplete = function (data, evt, targetDate) {
       targetDate = new Date(targetDate);

        data.waiting = true;




        var day = _.findIndex($scope.days, function(chr) {
            return moment(chr.date).hour(0).minute(0).second(0).millisecond(0).isSame(moment(targetDate).hour(0).minute(0).second(0).millisecond(0));
        });

        if(typeof $scope.days[day].cards === 'undefined') {
            $scope.days[day].cards = [];
            $scope.days[day].cards[0] = data;

        } else {
            var index = $scope.days[day].cards.indexOf(data);
            if (index === -1) {
                $scope.days[day].cards.push(data);
            }
        }


        var time  = new Date (data.badges.due);

        targetDate.setHours(time.getHours(), time.getMinutes(), time.getSeconds());

        changeDate.async(data.id, targetDate).then(function () {
                console.log("succes");
                data.waiting = false;
                data.due = targetDate;
                data.badges.due = targetDate;
            },
            function () {
                console.log("err");
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



});


angular.module('w11kcal.app.week').filter('max', function (){
        return function (arr, div) {
            return arr.filter(function (item, index) {
                return index < div;
            });
        };
    });


