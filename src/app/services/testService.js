/**
 * Created by can on 01.04.15.
 */
angular.module('starter').factory('dataService', function($q) {

    var data;
    var promise = $q.defer();
    var loginData;

    var login = $q.defer();
    var me = $q.defer();
    var cards = $q.defer();
    var boards = $q.defer();

    var doLogin = function(){

        var onAuthorize = function(){
            loginData = true;
            login.resolve("true");
            console.log("login valid");
        };

        var onError = function(){
            Trello.authorize({
                type: "popup",
                name: "w11k Trello",
                expiration: "never",
                scope: { read: true, write: true, account: true},
                success: onAuthorize
            })
        };

        Trello.authorize({
            interactive:false,
            success: onAuthorize,
            error: onError
        });
    };



    var getData = function(){
        doLogin();




        login.promise.then(function(){
            console.log("get Requests starten");
            Trello.get("members/me", function(response) {
                me.resolve(response);
            },function(){
                me.reject();
                console.log("error get me")
            });
            Trello.get("members/me/cards", function(response) {
                cards.resolve(response);
            },function(){
                cards.reject();
                console.log("error get me cards")

            });
            Trello.get("members/me/boards", function(response) {
                boards.resolve(response);
            },function(){
                boards.reject();
                console.log("error get me boards")
            });



        });

        var result = $q.all([me.promise, cards.promise, boards.promise])
            .then(function(result) {

                var cards = result[1];
                var boards = _.indexBy(result[2], 'id');

                cards.forEach(function(entry) {
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
        promFn: function(){
            console.log("PromFN fired");
            if(data){
                console.log("daten schon da");
                promise.resolve("yo");
            } else {
                getData().then(function(){
                    console.log("getDataRequets erfolgreich");
                    promise.resolve();
                });
            }
            return promise.promise;
        },
        get: function(){
            console.log("get fired");
            return data;
        },
        remove: function(){
            console.log("remove fired");
            data = null;
            loginData = false;
        },
        checkLogin: function(){
            console.log("checklogin fired")
            return loginData;
        },
        justLogin: function(){
            // Stellt nur den Login bereit (für Startseite Login/logout button)
            doLogin();
        }

    }


});
