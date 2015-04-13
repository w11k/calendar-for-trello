"use strict";
angular.module("w11kcal.app").factory("initService", /*ngInject*/  function ($q, $http, localStorageService, $window, demoSaveService) {

    var key = "41485cd87d154168dd6db06cdd3ffd69";
    var token = localStorageService.get("trello_token");
    var login, me, boards, cards, data;

    return {
        init: function (option) {
            login = $q.defer();
            if(!token){


                //$window.location.href ="https://trello.com/1/authorize?response_type=token&key=41485cd87d154168dd6db06cdd3ffd69&redirect_uri=http%3A%2F%2Ftrello-calendar.w11k.de%2F%23%2Fapp%2Ftoken%3Fdo%3Dsettoken&callback_method=fragment&scope=read%2Cwrite%2Caccount&expiration=never&name=w11k+Trello";
                $window.location.href ="https://trello.com/1/authorize?response_type=token&key=41485cd87d154168dd6db06cdd3ffd69&redirect_uri=http%3A%2F%2Flocalhost%3A9000%2F%23%2Fapp%2Ftoken%3Fdo%3Dsettoken&callback_method=fragment&scope=read%2Cwrite%2Caccount&expiration=never&name=w11k+Trello";
                return;
            }

            if(data && option != 1){
               // login.resolve(responses);
                login.resolve(data);

                demoSaveService.save(data);

            } else {
            me = $http.get("https://api.trello.com/1/members/me?key="+key+"&token="+token);
            boards = $http.get("https://api.trello.com/1/members/me/boards?key="+key+"&token="+token);
            cards = $http.get("https://api.trello.com/1/members/me/cards?key="+key+"&token="+token);
            $q.all([me, cards, boards])
                .then(function(responses) {
                    login.resolve(responses);
                    var cards = responses[1].data;
                    var boards = _.indexBy(responses[2].data, "id");
                    cards.forEach(function (entry) {
                        entry.waiting = false;
                        entry.boardName = boards[entry.idBoard].name;
                        entry.boardUrl = boards[entry.idBoard].url;
                        if (entry.due == null) {
                            entry.due = null;
                            return;
                        }
                        entry.due = new Date(entry.due);
                        if (entry.due instanceof Date) {
                            var dueDate = entry.due;
                            dueDate.setHours(0, 0, 0, 0);
                            entry.dueDate = dueDate;
                        }
                    });
                    responses[1].data = cards;
                    responses[2].data = boards;
                    demoSaveService.save(responses);
                    data = responses;

                });
            }

            return login.promise;
        }
    };








});