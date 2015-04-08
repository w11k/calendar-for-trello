'use strict';
// ToDo:
// Trello Client.js weg.

angular.module('w11kcal.app.month').config( /*ngInject*/  function($stateProvider,$urlRouterProvider) {
    $stateProvider
        .state('app.month-card', {
            url: '/month/detail/:cardId',
            views: {
                'menuContent': {
                    templateUrl: 'route/month/detail/card.html',
                    controller: 'detailCtrl',
                    resolve: {

                        'AsDataService':function($state, dataService,$stateParams,getMembers,$timeout,$q) {
                            // Zusätzlich zur Karte werden noch alle Member des Boardes geladen auf dem die Karte ist und erst dann wird die Ansicht gerendet.
                            // damit dann ein zuweisen von membern ermöglichen.
                            // die Member werden im Service gespeichert und müssen hier nicht mal ausgegeben werden.

                            var prom1 = $q.defer();
                            var prom2 = $q.defer();


                            return dataService.promFn().then(function(){
                                prom1.resolve();


                                console.log($stateParams.cardId);
                                console.log(dataService.get()[1]);




                                getMembers.board(dataService.get()[1][_.findKey(dataService.get()[1], {
                                    id: $stateParams.cardId
                                })].idBoard).then(function(data){

                                    $timeout(function(){
                                        prom2.resolve();

                                    },0);
                                    console.log(data);
                                });
                                return $q.all([prom1.promise, prom2.promise]);




                            });
                        }

                    }
                }
            }
        });
});




angular.module('w11kcal.app.month').controller('detailCtrl', /*ngInject*/  function($scope, getMembers, $stateParams, getAttachments, dataService, archiveCard, $location, Notification, getComments) {
    var data = dataService.get()[1];





    $scope.data = data[_.findKey(data, {
        id: $stateParams.cardId
    })];



    $scope.getMembers = function(id){
        getMembers.board(id).then(function(data){
            console.log(data)
        });
    };






    $scope.showComments = false;
    $scope.getComments = function() {
        $scope.showAttachments = false;
        getComments.async($stateParams.cardId).then(function(result) {
            $scope.showComments = $scope.showComments === false;
            $scope.data.comments = result;
        })
    };


    $scope.showAttachments = false;
    $scope.getAttachments = function() {
        $scope.showComments = false;
        getAttachments.async($stateParams.cardId).then(function(result) {
            $scope.showAttachments = $scope.showAttachments === false;
            $scope.data.attachments = result;

        })
    };


    $scope.close = function(){
        $scope.showAttachments = false;
        $scope.showComments = false;

    };




    $scope.archiveCard = function(id) {

        archiveCard.async(id).then(function() {
            var message = '<br>Archived <br><a ng-click="reactivate(' + id + ')">Undo</a>';
            Notification.warning({
                message: message
            });
        });
        $location.path("/app/month");
    };

    $scope.reactivate = function(id) {
        var path = "cards/" + id + "/closed";
        var params = {
            value: false
        };
        Trello.put(path, params)

    }
});