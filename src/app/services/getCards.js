angular.module('starter').factory('getCards', function($q,$timeout,$rootScope) {

    //promise.$$state.status === 0 // pending
    //promise.$$state.status === 1 // resolved
    // promise.$$state.status === 2 // rejected
    // keine Ausgabe?


    var promise =$q.defer();
    var promise1 =$q.defer();
    var promise2 =$q.defer();
    //var promise;
    //var promise1;
    //var promise2;
    var delay;
//    delay = 3000;
    var trigger;
    var trigger1;
    var trigger2;


    var getCards = {
        async: function(){
            if (!trigger){
                trigger = Trello.get("members/me", function(response) {
                    promise.resolve(response);
                });
            }

            if (!trigger1) {
                trigger1 = Trello.get("members/me/cards", function(response) {
                    promise1.resolve(response);
                });
            }

            if (!trigger2) {

                if(delay) {
                    $timeout(function() {
                        trigger2 = Trello.get("members/me/boards", function(response) {
                            promise2.resolve(response);
                        });
                    }, delay);
                } else {
                    trigger2 = Trello.get("members/me/boards", function(response) {
                            promise2.resolve(response);
                        });
                }

            }


            var result = $q.all([promise.promise, promise1.promise, promise2.promise])
                .then(function(responsesArray) {

                    var cards = responsesArray[1];
                    var boards = _.indexBy(responsesArray[2], 'id');

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
                    return responsesArray

                });
            return result;
        }
    };



    return getCards.async();
/*
    var deferred = $q.defer();
    var promise;
    var promise1;
    var promise2;
    var getCards = {
        async: function() {

            if (!promise) {
                promise = Trello.get("members/me", function(response) {
                    return response;

                })
            }
            if (!promise1) {
                promise1 = Trello.get("members/me/cards", function(response) {
                    return response;
                })
            }
            if (!promise2) {

                promise2 = Trello.get("members/me/boards", function(response) {
                    return response;
                })

            }
            var result = $q.all([promise, promise1, promise2])
                .then(function(responsesArray) {

                    var cards = responsesArray[1];
                    var boards = _.indexBy(responsesArray[2], 'id');

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
                    return responsesArray
                });
            console.log("fetched all");
            return result;
        }

    };

    deferred.resolve(getCards.async());
    return deferred.promise;

    */
});