"use strict";

angular.module("w11kcal.app").factory("dataService", /*ngInject*/  function ($q, $timeout) {


    var data, loginData, result, i = 0;
    var promise = $q.defer();
    var login = $q.defer();
    var me = $q.defer();
    var cards = $q.defer();
    var boards = $q.defer();




    function errAgain () {
        console.log("err")
    }



    var doLogin = function () {
        console.log("login wird ausgeführt");

        var onAuthorize = function () {
            loginData = true;
            login.resolve("true");
            console.log("login resolved");
        };

        var onError = function () {
            Trello.authorize({
                type: "redirect",
                name: "w11k Trello",
                expiration: "never",
                scope: { read: true, write: true, account: true},
                success: onAuthorize,
                error: errAgain
            })
        };


        Trello.authorize({
            interactive:false,
            success: onAuthorize,
            error: onError
        });

        loginData = true;
        login.resolve("true");


    };





    var getFromApi = function () {
        console.log("get Requests starten");

        Trello.get("members/me", function (response) {
            me.resolve(response);
            console.log("me resolved")
        },function () {
            me.reject();
            console.log("error get me")
        });

        Trello.get("members/me/cards", function (response) {
            cards.resolve(response);
            console.log("cards resolved")

        },function () {
            cards.reject();
            console.log("error get me cards")

        });

        Trello.get("members/me/boards", function (response) {
            boards.resolve(response);
            console.log("boards resolved")

        },function () {
            boards.reject();
            console.log("error get me boards")
        });
    };





    var getData = function () {


        if(loginData !== true){
            doLogin();
        }

        login.promise.then(function () {
                        getFromApi();
        });

        result = $q.all([me.promise, cards.promise, boards.promise])
            .then(function (result) {
                console.log("ALL DONE");
                var cards = result[1];
                var boards = _.indexBy(result[2], "id");
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
                data = result;
            });
        return result;
    };





    var refresh = function () {
        console.log("refresh starting..");
        // login entfällt.
        me = $q.defer();
        cards = $q.defer();
        boards = $q.defer();

        getData();

        result = $q.all([me.promise, cards.promise, boards.promise])
            .then(function (result) {
                var cards = result[1];
                var boards = _.indexBy(result[2], "id");
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
                data = result;
            });
        return result;
    };






    return {
        promFn: function () {

/*
            var superrpomise = $q.defer();
            $timeout(
                function () {
                    superrpomise.resolve();
                }, 3000);

            return superrpomise.promise;
            */
            console.log("PromFN fired");
            if(data){
                console.log("daten already loaded");
                promise.resolve("");
            } else {
                getData().then(function () {
                    console.log("getDataRequets erfolgreich");
                    promise.resolve();
                });
            }
            return promise.promise;
        },
        get: function () {
            console.log("get fired");
            return data;
        },
        remove: function () {
            data = null;
            loginData = false;
        },
        checkLogin: function () {
            console.log("checklogin fired");
            return loginData;
        },
        justLogin: function () {
            // Stellt nur den Login bereit (für Startseite Login/logout button)
            doLogin();
        },
        refresh: function () {
            return refresh()
        },

        update: function(id, name, value){
            data[1].forEach(function (obj) {
                if (obj.id === id) {
                    obj.due = value; // wegrationalisieren! ;)
                    obj.dueDate = value; // Zwecks einsortierung
                    obj.badges.due  = value;
                    console.log(obj)
                }
            });

        }

    }
});
