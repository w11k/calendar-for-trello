'use strict';
// ToDo:
// Trello get in Service
// Next/Prev

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
            }
        });

});

angular.module('starter.month').run(function () {
    moment.locale('de')
    });

angular.module('starter.month').controller('monthCtrl', function ($scope, $log) {
    var today = new Date();
    var month =  today.getMonth();
    $scope.monthName = moment.months()[month]
    var year = today.getFullYear()
    $scope.year = year;


    /*
     * Ermitteln wieviele Tage der Monat hat
     */


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


    /*
     * Kal aufbauen:
     */

    function cal (today, month, year){

        Date.prototype.mGetDay = function() {
            return (this.getDay() + 6) %7;
        }

        /*
         * Ermitteln an welchem Wochentag der Moant anfängt,
         * "dayOff" einfügen
         */

        var firstOfMonth = new Date(year, month,1,0,0,0,0)
        //var push = firstOfMonth.getDay()
        var push = firstOfMonth.mGetDay()
        // TODO: wird die mGetDay Version verwendet dann stimmen im Februar die Monatstage nicht mehr.

        // Januar abfangen
        if(month == 0){
            var lastMonthDays = 31-push
            var yearIn = year -1;
            var monthIn = 11;
        } else {
            var lastMonthDays = getMonthDays(month-1,year)-push
            var yearIn = year;
            var monthIn = month-1;
        }


        /*
         * get cards, get boards, match
         */

        var onAuthorize = function() {
            updateLoggedIn();
                Trello.get("members/me/cards", function(cards) {
                    Trello.get("members/me/boards", function(boards) {

                        var boards = _.indexBy(boards, 'id')
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

                        delete cards.undefined
                        console.log(cards)

                        $scope.days = [];
                        for ( var i = 0; i < push; i++) {
                            lastMonthDays  = lastMonthDays+1;
                            $scope.days.push({dayOff: true, i : lastMonthDays, date: new Date(yearIn,monthIn,lastMonthDays,0,0,0,0), cards:[]})
                        }
                        // build cal
                        for (var d = 0; d < getMonthDays(month, year); d++){
                            $scope.days.push({dayOff: false, i : d+1, date: new Date(year,month,d+1,0,0,0,0), cards: []})
                            //console.log(days[d+i].date + " d: "+(d+1))
                        }
                        // ToDO: Bei den Dates werden manche mit CET und CEST ausgegeben- ist das die FEhler QUelle?


                        $scope.days.forEach(function(entry){
                            entry.cards= cards[entry.date];
                           // console.log(entry.date);
                            //console.log(cards[entry.date]);

                        });




                        $scope.cards = cards;
                        //console.log($scope.days)

                        $scope.$apply();
                    })
                })
        };

        var updateLoggedIn = function() {
            var isLoggedIn = Trello.authorized();
            //console.log(isLoggedIn)
            $scope.login = isLoggedIn;
            $("#loginPanel").toggle(!isLoggedIn);
            $("#cardPanel").toggle(isLoggedIn);

        };
        Trello.authorize({
            interactive: false,
            success: onAuthorize
        });





    }
    /* fake date  test

       year = 2015;
        month = 1;
        today = new Date(year,month,1,11,33,30,0);
     */

    cal(today, month, year);


    $scope.move = function(steps){
        console.log(month+ "wird plus 1")
        month = month + steps;
        console.log(month+ "ist er jetzt")

        if(month == 11){
            month = 0
            year++;

        } else if ( month == -1){
            month = 11
            year--;

        }
        $scope.monthName = moment.months()[month]
        $scope.year = year;
        cal (today, month, year)


    }






});






