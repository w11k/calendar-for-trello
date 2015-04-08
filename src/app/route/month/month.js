'use strict';


angular.module('w11kcal.app.month', []);
angular.module('w11kcal.app.month').config(/*ngInject*/ function ($stateProvider) {
    console.log("w11kcal.app.month.config läuft.");

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
                'AsDataService':function(dataService){
                    console.log("resolve function initiert dataService");
                    return dataService.promFn();
                }
            }
        })
});

angular.module('w11kcal.app.month').run(function () {
    console.log("w11kcal.app.month.run läuft.");

    moment.locale('de')
});

angular.module('w11kcal.app.month').controller('monthCtrl', /*ngInject*/ function (dataService, $scope, $stateParams,$state, changeDate,$location, archiveCard, Notification, $rootScope) {
    console.log("w11kcal.app.month.monthCtrl läuft.");

    $rootScope.DragProcess= false;

    console.log($stateParams.date+"x");


    if ($stateParams.date !== ""){
        console.log("eingetreten")
        var setDate = $stateParams.date.split('-', 2);
        today = new Date(setDate[0],setDate[1], 1);

    }else {
        var today = new Date();
        $location.path("/app/month/"+today.getFullYear()+"-"+today.getMonth()).replace();
    }


    $scope.loading = false;
    $scope.refresh = function (){
        if($scope.loading === false){
            $scope.loading = true;
            console.log("sss")
            dataService.refresh()
                .then(function(){
                    console.log("resolved from ctrl")
                    $scope.loading = false;

                    cal(today, month, year);

                });
        }
    };


   /* $scope.refresh = function (){
        if($scope.loading === false){
            dataService.refresh().then(function(){
                console.log("daten sind da");
                cal(today, month, year);
            })

    }};*/

    $scope.login = dataService.checkLogin();

    $scope.auth = function() {
        $loction.path("/app/month/")
     };
    $scope.logout = function(){
        Trello.deauthorize();
        $location.path("/app/dash/");
        dataService.remove();
        console.log(dataService.get());
    };


   // var data = dataService.get();
    var month =  today.getMonth();

    // Ausgabe Werte für View (Monatsname, Jahr ..)
    var year = today.getFullYear();


    $scope.year = year;
    $scope.weekdays = [];

    for (var i = 0; i <= 6; i++){
        var long =  moment().weekday(i).format("dddd");
        var short = moment().weekday(i).format("dd");
        $scope.weekdays[i] = [short, long]
    }

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
        $scope.date = {};
        $scope.date.iso = new Date(year, month, 1);
        $scope.date.monthName =  moment.months()[month];
        $scope.date.prev = [moment.months()[month-1] , year];
        $scope.date.next = [moment.months()[month+1] , year];
        $scope.date.month = $scope.date.iso.getMonth();
        $scope.date.year = year;

        if (month == 0){
            //Januar
            console.log("jan");

            $scope.date.prev = [moment.months()[11] , year-1];
            $scope.date.next = [moment.months()[1] , year];
        }else if (month == 11){
            // dez
            console.log("dez");
            $scope.date.prev = [moment.months()[10], year];
            $scope.date.next = [moment.months()[0] , year+1];
        }

        Date.prototype.mGetDay = function() {
            return (this.getDay() + 6) %7;
        };
        var cards = dataService.get()[1];
        //  var boards = data[2];
        var firstOfMonth = new Date(year, month,1,0,0,0,0);
        var push = firstOfMonth.mGetDay();
        if (push === 0){
            console.log("ist null");
            push = 7;
        }
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

        for (var i = 0; i < push; i++) {
            lastMonthDays = lastMonthDays + 1;
            $scope.days.push({
                dayOff: true,
                i: lastMonthDays,
                date: new Date(yearIn, monthIn, lastMonthDays, 0, 0, 0, 0),
                cards: [],
                weekday: moment(new Date(yearIn, monthIn, lastMonthDays, 0, 0, 0, 0)).format("dddd")
                ///, waiting: false aktiviern wenn day auch waiting zustand haben soll
            });
        }
        for (var d = 0; d < getMonthDays(month, year); d++){
            $scope.days.push({
                dayOff: false,
                i : d+1,
                date: new Date(year,month,d+1,0,0,0,0),
                cards: [],
                weekday: moment(new Date(year,month,d+1,0,0,0,0)).format("dddd")
                ///, waiting: false aktiviern wenn day auch waiting zustand haben soll
            });
        }

        var a = $scope.days.length;

        if (a % 7 != 0) {

            a = 7-(a % 7);
        } else {
            a = 7;
        }

        for (var i = 0; i < a; i++) {

            $scope.days.push({
                dayOff: true,
                i: i+1,
                date: new Date(year, month+1, i+1, 0, 0, 0, 0),
                cards: [],
                weekday: moment(new Date(year, month+1, i+1, 0, 0, 0, 0)).format("dddd")
                ///, waiting: false aktiviern wenn day auch waiting zustand haben soll
            });
        }
        // Jetzt zähle die Tage dann teil durch / und füg an.

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
        $scope.year = year;
        // Cal neu aufbauen:


        $location.path("/app/month/"+year+"-"+month);

        cal (today, month, year);
        //$scope.$apply();
    };


    $scope.click = function (id){
        $location.path("app/month/detail/"+id)
    };

    // Drag 'n Drop
    $scope.onDragSuccess = function(data, evt, from) {
        var index = $scope.days[from].cards.indexOf(data);
        if (index > -1) {
            $scope.days[from].cards.splice(index, 1);
        }
        //$scope.DragProcess = true;
    };

    $scope.onDropComplete = function(data, evt, target,targetDate) {
        //$scope.DragProcess = false;
        data.waiting = true;
        //$scope.days[target].waiting = true; aktiviern wenn day auch waiting zustand haben soll
        if(typeof  $scope.days[target].cards === 'undefined'){
            $scope.days[target].cards = [];
            $scope.days[target].cards[0] = data;

        } else {
            var index = $scope.days[target].cards.indexOf(data);
            if (index == -1)
                $scope.days[target].cards.push(data);
        }
        targetDate.setHours(12, 0, 0);
        changeDate.async(data.id, targetDate).then(function(){
                console.log("succes");
                //$scope.days[target].waiting = false; aktiviern wenn day auch waiting zustand haben soll
                data.waiting = false;
                data.due = targetDate;
                data.dueDate = targetDate;


            },
            function(){
                console.log("err");
            })
    };





    $scope.changeMonth = function(data, param, month){
        if(data.due.getMonth() !== month)      {
            var targetDate = moment(data.dueDate).add(0, 'month').toISOString();
            targetDate =new Date(targetDate);
            targetDate = new Date(targetDate.setDate(1));
        }else {
            var targetDate = moment(data.dueDate).add(1, 'month').toISOString();
            targetDate =new Date(targetDate);
            targetDate = new Date(targetDate.setDate(1));
        }


        changeDate.async(data.id, targetDate).then(function(){
                console.log("succes");
            },
            function(){
                console.log("err");
            });


    };

    $scope.archiveCard = function(data){
        var id = data.id;

        archiveCard.async(id).then(function(){
            var message = '<span ng-controller="archiveCtrl"><br>Archived <br><a ng-click="click('+id+')">Undo</a></span>';
            Notification.warning({message: message});
        });
    };


    $scope.reactivate = function(id) {
        console.log("st")


    };




});








