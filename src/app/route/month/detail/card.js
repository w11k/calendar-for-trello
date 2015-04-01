'use strict';
// ToDo:
// Trello Client.js weg.

angular.module('starter.month').config(function($stateProvider) {
    $stateProvider
        .state('tab.month-card', {
            url: '/month/detail/:cardId',
            views: {
                'menuContent': {
                    templateUrl: 'route/month/detail/card.html',
                    controller: 'detailCtrl',
                    resolve: {
                        getCardsFromResolve: "getCards"

                    }
                }
            }
        });
});




angular.module('starter.month').controller('detailCtrl', function($scope, $stateParams, getAttachments, getCardsFromResolve, archiveCard, $location, Notification, getComments) {
    var data = getCardsFromResolve[1];

    $scope.data = data[_.findKey(data, {
        id: $stateParams.cardId
    })];




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
        $location.path("tab/month");
    };

    $scope.reactivate = function(id) {
        var path = "cards/" + id + "/closed";
        var params = {
            value: false
        };
        Trello.put(path, params)

    }
});