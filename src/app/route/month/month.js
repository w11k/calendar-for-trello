'use strict';

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

});

angular.module('starter.month').controller('monthCtrl', function ($scope) {



    var weekdays = new Array(7);
    weekdays[0]=  "Sunday";
    weekdays[1] = "Monday";
    weekdays[2] = "Tuesday";
    weekdays[3] = "Wednesday";
    weekdays[4] = "Thursday";
    weekdays[5] = "Friday";
    weekdays[6] = "Saturday";

    var today = new Date();
    var month =  today.getMonth();
    var year = today.getFullYear()


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
        }

        // how many days off
        // Immer den Wochentag des 1. des Monats bestimmen
        var firstOfMonth = new Date(year, month,1,0,0,0,0)
        //var push = firstOfMonth.getDay()
        var push = firstOfMonth.mGetDay()
        // TODO: wird die mGetDay Version verwendet dann stimmen im Februar die Monatstage nicht mehr.

        // Januar abfangen
        if(month == 0){
            var lastMonthDays = 31-push
            console.log("jan")
            var yearIn = year -1;
            var monthIn = 11;
        } else {
            console.log("übergebe monat:"+month)

            var lastMonthDays = getMonthDays(month-1,year)-push
            console.log("getMonthDays: "+getMonthDays(month-1, year))
            console.log(getMonthDays(month,year)-push)
            var yearIn = year;
            var monthIn = month-1;

        }



        /*
         * ToDo noch ohne dates filtern.
         * 1. date1.setHours(0,0,0,0) um Uhrzeit auf 0 zu setzen
         * 2. date vergleichen
         */



        var onAuthorize = function() {
            updateLoggedIn();
            // get me, get cards, get boards, match
                Trello.get("members/me/cards", function(cards) {
                    Trello.get("members/me/boards", function(boards) {

                        var boards = _.indexBy(boards, 'id')
                        cards.forEach(function(entry) {


                            entry.boardName = boards[entry.idBoard].name;
                            entry.boardUrl = boards[entry.idBoard].url;
                            entry.due = new Date(entry.due)  // String muss erst in ein Date konvertiert werden!

                            if (entry.due instanceof Date) { // wenn date nicht leer da sonst fehler
                                var dueDate = entry.due;     // geht nicht.
                                dueDate.setHours(0,0,0,0);
                                entry.dueDate = dueDate;
                                console.log(entry.dueDate)
                            }
                        });
                        // ToDo: Einträge ohne due Date löschen



                         cards = _.indexBy(cards, 'dueDate')




                        $scope.days = [];
                        for ( var i = 0; i < push; i++) {
                            lastMonthDays  = lastMonthDays+1
                            $scope.days.push({dayOff: true, i : lastMonthDays, date: new Date(yearIn,monthIn,lastMonthDays,0,0,0,0), cards:[]})
                        }
                        // build cal
                        for (var d = 0; d < getMonthDays(month, year); d++){
                            $scope.days.push({dayOff: false, i : d+1, date: new Date(year,month,d+1,0,0,0,0), cards: []})
                            //console.log(days[d+i].date + " d: "+(d+1))
                        }
                        // ToDO: Bei den Dates werden manche mit CET und CEST ausgegeben- ist das die FEhler QUelle?


                        $scope.days.forEach(function(entry){


                            entry.cards.push(cards[entry.date])
                           // console.log(entry.date);
                            //console.log(cards[entry.date]);

                        });




                        $scope.cards = cards
                        console.log($scope.days)

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
        month = 4;
        today = new Date(year,month,1,11,33,30,0);
     */
    cal(today, month, year);
});






