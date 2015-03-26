'use strict';
// ToDo:
// Trello get in Service auslagern
// übergibt Trello die local einstellung des Nutzers?

angular.module('starter.month', []);
angular.module('starter.month').config(function ($stateProvider) {
    $stateProvider
        .state('tab.month', {
            url: '/month',
            views: {
                'menuContent': {
                    templateUrl: 'route/month/month.html',
                    controller: 'monthCtrl'
                }
            },
            resolve: {
                getCards1: "getCards"
            }
        });
});

angular.module('starter.month').run(function () {
    Trello.authorize({
        interactive: false
    });
    moment.locale('de')
});

angular.module('starter.month').controller('monthCtrl', function ($scope, getCards1) {
    var data = getCards1;
    var today = new Date();
    var month =  today.getMonth();
    $scope.monthName = moment.months()[month];
    var year = today.getFullYear();
    $scope.year = year;
    $scope.weekdays = [];

    for (var i = 0; i <= 6; i++){
        var long =  moment().weekday(i).format("dddd");
        var short = moment().weekday(i).format("dd");
        $scope.weekdays[i] = [short, long]
        }
    console.log($scope.weekdays);



    function getMonthDays (month, year){
        var dayCounter = 31;
        // April, Juni, September, Nov 30 tage
        if (month == 3 || month == 5 || month == 8 || month == 10) --dayCounter;
        // Februar Schaltjahre
        if (month == 1) {
            dayCounter = dayCounter-3;
            if (year  %   4 == 0) dayCounter++;
            if (year % 100 == 0) dayCounter--;
            if (year % 400 == 0) dayCounter++;
        }
        return dayCounter;
    }


    function cal (today, month, year){
        Date.prototype.mGetDay = function() {
            return (this.getDay() + 6) %7;
        };
        var cards = data[0];
        var boards = data[1];
        var firstOfMonth = new Date(year, month,1,0,0,0,0);
        var push = firstOfMonth.mGetDay();
        // Januar abfangen
        if(month == 0){
            var lastMonthDays = 31-push;
            var yearIn = year -1;
            var monthIn = 11;
        } else {
            var lastMonthDays = getMonthDays(month-1,year)-push;
            var yearIn = year;
            var monthIn = month-1;
        }

        $scope.days = [];
        for ( var i = 0; i < push; i++) {
            lastMonthDays  = lastMonthDays+1;
            $scope.days.push({
                dayOff: true,
                i : lastMonthDays,
                date: new Date(yearIn,monthIn,lastMonthDays,0,0,0,0),
                cards:[],
                weekday: moment(new Date(yearIn,monthIn,lastMonthDays,0,0,0,0)).format("dddd")


            });
        }
        for (var d = 0; d < getMonthDays(month, year); d++){
            $scope.days.push({
                dayOff: false,
                i : d+1,
                date: new Date(year,month,d+1,0,0,0,0),
                cards: [],
                weekday: moment(new Date(year,month,d+1,0,0,0,0)).format("dddd")
            });
        }


        boards = _.indexBy(boards, 'id');
        cards.forEach(function(entry) {

            entry.boardName = boards[entry.idBoard].name;
            entry.boardUrl = boards[entry.idBoard].url;

            if(entry.due == null){
                entry.due = null;
                return;
            }

            entry.due = new Date(entry.due);
            if (entry.due instanceof Date) {
                var dueDate = entry.due;
                dueDate.setHours(0,0,0,0);
                entry.dueDate = dueDate;
            }
        });

        cards = _.groupBy(cards, 'dueDate');
        delete cards.undefined;
        $scope.days = _.indexBy($scope.days, 'date');
        $scope.days = _.toArray($scope.days);
        $scope.days.forEach(function(entry){
            entry.cards= cards[entry.date];
        });
    }
    // cal erstmals aufbauen.
    cal(today, month, year);


    $scope.move = function(steps){
        month = month + steps;
        if(month == 11){
            month = 0;
            year++;

        } else if ( month == -1){
            month = 11;
            year--;

        }
        $scope.monthName = moment.months()[month];
        $scope.year = year;
        // Cal neu aufbauen:
        cal (today, month, year)
    }
});









