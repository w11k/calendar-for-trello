"use strict";
angular.module("w11kcal.app").factory("initService", /*ngInject*/  function ($q, $http, localStorageService, $window, baseUrl, AppKey) {

    var key = AppKey;
    var token = localStorageService.get("trello_token");
    var login, me, boards, cards, data;
    login = $q.defer();


    return {
        init: function (option) {
            if(!token) {
                $window.location.href ="https://trello.com/1/authorize?response_type=token&key="+key+"&redirect_uri="+encodeURI(baseUrl)+"%2F%23%2Fapp%2Ftoken%3Fdo%3Dsettoken&callback_method=fragment&scope=read%2Cwrite%2Caccount&expiration=never&name=w11k+Trello";
                login.reject("kein Token");
            } else {
            if(data && option !== 1) {
                console.log("data already fetched");
                login.resolve(data);
            } else {
            me = $http.get("https://api.trello.com/1/members/me?key="+key+"&token="+token);
            boards = $http.get("https://api.trello.com/1/members/me/boards?key="+key+"&token="+token);
            cards = $http.get("https://api.trello.com/1/members/me/cards?key="+key+"&token="+token);

            $q.all([me, cards, boards])
                .then(function (responses) {
                    console.log("delay");
                    var cards = responses[1].data;
                    var boards = _.indexBy(responses[2].data, "id");
                    cards.forEach(function (entry) {
                        entry.waiting = false;
                        entry.boardName = boards[entry.idBoard].name;
                        entry.boardUrl = boards[entry.idBoard].url;
                        entry.color = boards[entry.idBoard].prefs.backgroundColor;
                        if (entry.due === null) {
                            entry.due = null;
                            return;
                        }
                        var dueDay = entry.due;
                        entry.dueDay = new Date(new Date(dueDay).setHours(0,0,0,0));
                        entry.due = new Date(entry.due);

                    });
                    responses[1].data = cards;
                    responses[2].data = boards;
                    data = responses;
                    login.resolve(responses);
                });
            }
            }
            return login.promise;
        },



        refresh: function () {

           var status = $q.defer();
           var me = $http.get("https://api.trello.com/1/members/me?key="+key+"&token="+token);
           var boards = $http.get("https://api.trello.com/1/members/me/boards?key="+key+"&token="+token);
           var cards = $http.get("https://api.trello.com/1/members/me/cards?key="+key+"&token="+token);


            $q.all([me, cards, boards])
                .then(function (responses) {
                    console.log("delay");
                    var cards = responses[1].data;
                    var boards = _.indexBy(responses[2].data, "id");
                    cards.forEach(function (entry) {
                        entry.waiting = false;
                        entry.boardName = boards[entry.idBoard].name;
                        entry.boardUrl = boards[entry.idBoard].url;
                        entry.color = boards[entry.idBoard].prefs.backgroundColor;
                        if (entry.due === null) {
                            entry.due = null;
                            return;
                        }
                        var dueDay = entry.due;
                        entry.dueDay = new Date(new Date(dueDay).setHours(0,0,0,0));
                        entry.due = new Date(entry.due);

                    });
                    responses[1].data = cards;
                    responses[2].data = boards;
                    data = responses;
                    status.resolve(responses);
                });

            return status.promise;
            //return status.promise;
        },



        print: function () {
            return data;
        },

        remove: function () {
            data = null;
        }
    };
});