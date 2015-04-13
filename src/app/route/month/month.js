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
                'asInitService':function (initService){
                    return initService.init();
                },isFreshView: function () {
                    return false;
                }
            }
        })
        .state('app.month-fresh', {
            url: '/month',
            views: {
                'menuContent': {
                    templateUrl: 'route/month/month.html',
                    controller: 'monthCtrl'
                }
            },
            resolve: {
                'asInitService':function (initService){
                    return initService.init();
                },
                isFreshView: function () {
                    return true;
                }
            }
        });
});







angular.module('w11kcal.app.month').run(function () {
});

angular.module('w11kcal.app.month').controller('monthCtrl', /*ngInject*/ function (initService,archiveCard, $scope, changeDate,Notification, demoSaveService,$window,isFreshView,$stateParams, $location,buildCalService) {

    /**
     * Part 1: config
     */
    var today, month, year;

    if(demoSaveService.print()){
        $scope.login = true;
    }

    if(isFreshView){
        // set recent month
        today = new Date();
        $location.path("/app/month/"+today.getFullYear()+"-"+(today.getMonth()+1)).replace();
    } else {
        // set transmitted month
        var setDate = $stateParams.date.split('-', 2);
        today = new Date(setDate[0],(setDate[1]-1), 1);

        if(setDate[1] === undefined){
            // wrong date set in url, redirecting to today
            today = new Date();
            $location.path("/app/month/"+today.getFullYear()+"-"+(today.getMonth()+1)).replace();
        }
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
    for (var i = 0; i <= 6; i++){
        var long =  moment().weekday(i).format("dddd");
        var short = moment().weekday(i).format("dd");
        $scope.weekdays[i] = [short, long]
    }
    // build the Cal
    $scope.days = buildCalService.build(date);

    // Build Filter




    var boards = demoSaveService.print()[2].data;

    $scope.boards = [];

    _.forEach(boards, function (board) {
        $scope.boards.push({
            name: board.name,
            id: board.id,
            ticked: true
        })
    });



    $scope.activeBoard = function (card) {

        console.log(card.name);
        console.log(card.idBoard);
        console.log($scope.selectedBoards);



        if(_.find($scope.selectedBoards, function(chr) {
                return chr.id == card.idBoard;
            })){
            console.log("true")
            return true;
        } else {
            console.log("false")
            return false;

        }
    }




    /**
     * Part 3: Options:
     */

    $scope.loading = false;
    $scope.refresh = function () {
        if($scope.loading === false){
            $scope.loading = true;
            initService.init(1)
                .then(function () {
                    $scope.loading = false;
                    $scope.days = buildCalService.build(date);
                    // !# CalendarBuildService aufrufen.
                });
        }
    };

    $scope.logout = function (){
        demoSaveService.remove();
        $scope.login = false;
        console.log(demoSaveService.print());
        $window.location.reload();
    };

    $scope.move = function (steps){
        year = date.year;
        month = (date.month + steps);
        if(month >= 12){
            month = 0;
            year++;
        } else if ( month <= -1){
            month = 11;
            year--;
        }
        // year;
        $location.path("/app/month/"+year+"-"+(month+1));
    };




    $scope.click = function (id){
       console.log("click on card" +id)
    };

    // Drag 'n Drop
    $scope.onDragSuccess = function (data, evt, from) {
        var index = $scope.days[from].cards.indexOf(data);
        if (index > -1) {
            $scope.days[from].cards.splice(index, 1);
        }
        //$scope.DragProcess = true;
    };

    $scope.onDropComplete = function (data, evt, target,targetDate) {
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
        changeDate.async(data.id, targetDate).then(function (){
                console.log("succes");
                //$scope.days[target].waiting = false; aktiviern wenn day auch waiting zustand haben soll
                data.waiting = false;
                data.due = targetDate;
                data.dueDate = targetDate;


            },
            function (){
                console.log("err");
            })
    };





    $scope.changeMonth = function (data, param, month){
        if(data.due.getMonth() !== month)      {
            var targetDate = moment(data.dueDate).add(0, 'month').toISOString();
            targetDate =new Date(targetDate);
            targetDate = new Date(targetDate.setDate(1));
        }else {
            var targetDate = moment(data.dueDate).add(1, 'month').toISOString();
            targetDate =new Date(targetDate);
            targetDate = new Date(targetDate.setDate(1));
        }


        changeDate.async(data.id, targetDate).then(function (){
                console.log("succes");

            },
            function (){
                console.log("err");
            });


    };

    $scope.archiveCard = function (data){
        var id = data.id;

        archiveCard.async(id).then(function (){

            console.log(".then")


            var message = '<span ng-controller="archiveCtrl"><br>Archived </span>';
            Notification.warning({message: message});
        });
    };


});








