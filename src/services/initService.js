'use strict';
angular.module('trelloCal').factory('initService', /*ngInject*/  function ($q, webStorage, $http, $mdDialog, $rootScope, $window, baseUrl, AppKey) {


        /**
         *Init variables
         */

        var key = AppKey;
        var token = webStorage.get('trello_token');
        var login, me, data, colors;
        login = $q.defer();

        var colorizeCards = true;
        var observer = false;
        var autorefresh = true;
        var version = '0.1.25';

        /**
         *firstInit pulls the userinformation and board colors
         * fields: fullName, id  fields: color,id,...
         * */
        var firstInit = function () {
            var deferred = $q.defer();
            token = webStorage.get('trello_token');
            if (!webStorage.has('TrelloCalendarStorage')) {
                webStorage.set('TrelloCalendarStorage', {});
            }
            var TrelloCalendarStorage = webStorage.get('TrelloCalendarStorage');
            var cache = webStorage.get('TrelloCalendarStorage');
            me = $http.get('https://api.trello.com/1/members/me?fields=fullName&key=' + key + '&token=' + token);
            colors = $http.get('https://api.trello.com/1/members/me/boardBackgrounds?key=' + key + '&token=' + token);
            $q.all([me, colors]).then(function (responses) {

                TrelloCalendarStorage.me = responses[0].data;
                TrelloCalendarStorage.colors = _.indexBy(responses[1].data, 'id');
                if (cache.me) {
                    if (cache.me.observer === undefined) {
                        TrelloCalendarStorage.me.observer = observer;
                    }
                    else {
                        TrelloCalendarStorage.me.observer = cache.me.observer;
                    }
                    if (cache.me.colorizeCards === undefined) {
                        TrelloCalendarStorage.me.boardColors = colorizeCards;
                    }
                    else {
                        TrelloCalendarStorage.me.colorizeCards = cache.me.colorizeCards;
                    }
                    if (cache.me.version === undefined) {
                        TrelloCalendarStorage.me.version = version;
                    }
                    else {
                        TrelloCalendarStorage.me.version = cache.me.version;
                    }
                    if (cache.me.autorefresh === undefined) {
                        TrelloCalendarStorage.me.autorefresh = autorefresh;
                        console.log('refresh init ');

                    }
                    else {
                        TrelloCalendarStorage.me.autorefresh = cache.me.autorefresh;

                    }
                }
                else {
                    TrelloCalendarStorage.me.observer = observer;
                    TrelloCalendarStorage.me.colorizeCards = colorizeCards;
                    TrelloCalendarStorage.me.version = version;
                    TrelloCalendarStorage.me.autorefresh = autorefresh;
                }

                if (!TrelloCalendarStorage.boards) {
                    TrelloCalendarStorage.boards = {};
                }
                if (!TrelloCalendarStorage.cards) {
                    TrelloCalendarStorage.cards = {};
                }
                if (!TrelloCalendarStorage.cards.all) {
                    TrelloCalendarStorage.cards.all = {};
                }
                if (!TrelloCalendarStorage.cards.my) {
                    TrelloCalendarStorage.cards.my = {};
                }
                TrelloCalendarStorage.cards = {
                    'all': TrelloCalendarStorage.cards.all,
                    'my': TrelloCalendarStorage.cards.my
                };
                webStorage.set('TrelloCalendarStorage', TrelloCalendarStorage);
                deferred.resolve('init');

            });
            return deferred.promise;
        };
        /**
         *pullBoards pulls open Boards from Trello
         *fields: name, shortUrl, id, prefs {background,backgroundColor,...}
         * */
        var pullBoards = function () {
            var deferred = $q.defer();
            var TrelloCalendarStorage = webStorage.get('TrelloCalendarStorage');
            var temp = webStorage.get('TrelloCalendarStorage');

            $http.get('https://api.trello.com/1/members/me/boards/?fields=name,shortUrl,prefs&filter=open&key=' + key + '&token=' + token).then(function (responses) {


                _.forEach(responses.data, function (board) {
                    if (TrelloCalendarStorage.boards[board.id]) {
                        TrelloCalendarStorage.boards[board.id].name = board.name;
                        TrelloCalendarStorage.boards[board.id].shortUrl = board.shortUrl;
                        TrelloCalendarStorage.boards[board.id].id = board.id;
                        TrelloCalendarStorage.boards[board.id].prefs = board.prefs;
                        TrelloCalendarStorage.boards[board.id].prefs.background = temp.boards[board.id].prefs.background;
                        TrelloCalendarStorage.boards[board.id].prefs.backgroundColor = temp.boards[board.id].prefs.backgroundColor;

                        if (TrelloCalendarStorage.boards[board.id].enabled === undefined) {
                            TrelloCalendarStorage.boards[board.id].enabled = true;
                        }

                    }
                    else {
                        TrelloCalendarStorage.boards[board.id] = board;
                        TrelloCalendarStorage.boards[board.id].enabled = true;

                    }
                });
                webStorage.set('TrelloCalendarStorage', TrelloCalendarStorage);
                deferred.resolve('boards');
            });
            return deferred.promise;
        };
        /**
         *pullLists pulls open Lists from Trello
         *fields: id, name
         * */
        var pullLists = function () {
            var deferred = $q.defer();
            var TrelloCalendarStorage = webStorage.get('TrelloCalendarStorage');
            var listRequests = [];
            var alllists = [];
            _.forEach(TrelloCalendarStorage.boards, function (board) {
                listRequests.push($http.get('https://api.trello.com/1/boards/' + board.id + '/lists/?fields=name&filter=open&key=' + key + '&token=' + token));
            });
            $q.all(listRequests).then(function (responses) {
                _.forEach(responses, function (lists) {
                    alllists = alllists.concat(lists.data);
                });
                TrelloCalendarStorage.lists = _.indexBy(alllists, 'id');
                webStorage.set('TrelloCalendarStorage', TrelloCalendarStorage);
                deferred.resolve('lists');
            });
            return deferred.promise;
        };
        /**
         *switches between pull my/all Cards
         */
        var pullCards = function () {
            var deferred = $q.defer();
            var TrelloCalendarStorage = webStorage.get('TrelloCalendarStorage');
            if (TrelloCalendarStorage.me.observer && TrelloCalendarStorage.me.observer === true) {
                pullAllCards().then(function () {
                    deferred.resolve();
                });
            }
            else {
                pullMyCards().then(function () {
                    deferred.resolve();
                });
            }

            return deferred.promise;
        };
        /**
         *pullMyCards pulls open Cards from Trello
         *if me/observer is false
         *fields: id, name,idList,dateLastActivity,shortUrl,due,idBoard
         * */
        var pullMyCards = function () {
            var deferred = $q.defer();
            var TrelloCalendarStorage = webStorage.get('TrelloCalendarStorage');
            $http.get('https://api.trello.com/1/members/me/cards/?fields=idList,name,dateLastActivity,shortUrl,due,idBoard&filter=open&key=' + key + '&token=' + token).then(function (responses) {
                var myCards = responses.data;
                for (var card in myCards) {
                    if (TrelloCalendarStorage.boards[myCards[card].idBoard]) {
                        myCards[card].boardName = (TrelloCalendarStorage.boards[myCards[card].idBoard]).name;
                        var dueDay = myCards[card].due;
                        myCards[card].dueDay = new Date(new Date(dueDay).setHours(0, 0, 0, 0)).toUTCString();
                        myCards[card].color = (TrelloCalendarStorage.boards[myCards[card].idBoard]).prefs.backgroundColor;
                    }
                    if (TrelloCalendarStorage.lists[myCards[card].idList]) {
                        myCards[card].listName = (TrelloCalendarStorage.lists[myCards[card].idList]).name;
                    }

                }

                TrelloCalendarStorage.cards.my = _.indexBy(myCards, 'id');
                webStorage.set('TrelloCalendarStorage', TrelloCalendarStorage);
                login.resolve(TrelloCalendarStorage);
                deferred.resolve('myCards');
            });
            return deferred.promise;

        };
        /**
         *pullAllCards pulls open Cards from Trello
         *if me/observer is true
         *fields: id, name,idList,dateLastActivity,shortUrl,due,idBoard
         * */
        var pullAllCards = function () {
            var deferred = $q.defer();
            var TrelloCalendarStorage = webStorage.get('TrelloCalendarStorage');
            var cardRequests = [];
            var allCards = [];
            _.forEach(TrelloCalendarStorage.boards, function (board) {
                cardRequests.push($http.get('https://api.trello.com/1/boards/' + board.id + '/cards/?fields=idList,name,dateLastActivity,shortUrl,due,idBoard&filter=open&key=' + key + '&token=' + token));
            });
            $q.all(cardRequests).then(function (responses) {
                _.forEach(responses, function (lists) {
                    allCards = allCards.concat(lists.data);
                });

                for (var card in allCards) {

                    if (TrelloCalendarStorage.boards[allCards[card].idBoard]) {

                        allCards[card].boardName = (TrelloCalendarStorage.boards[allCards[card].idBoard]).name;
                        var dueDay = allCards[card].due;
                        allCards[card].dueDay = new Date(new Date(dueDay).setHours(0, 0, 0, 0)).toUTCString();
                        allCards[card].color = (TrelloCalendarStorage.boards[allCards[card].idBoard]).prefs.backgroundColor;

                    }
                    if (TrelloCalendarStorage.lists[allCards[card].idList]) {
                        allCards[card].listName = (TrelloCalendarStorage.lists[allCards[card].idList]).name;
                    }
                }
                TrelloCalendarStorage.cards.all = _.indexBy(allCards, 'id');
                webStorage.set('TrelloCalendarStorage', TrelloCalendarStorage);
                login.resolve(TrelloCalendarStorage);
                deferred.resolve('allCards');
            });
            return deferred.promise;
        };
        /**
         * update() updates boards, lists, and cards
         */
        var update = function () {
            var deferred = $q.defer();
            pullBoards().then(function () {
                pullLists().then(function () {
                    pullCards().then(function () {
                        deferred.resolve('update');
                    });
                });

            }); //runs pullLists() and  pullCards();

            return deferred.promise;

        };

        var updateAll = function () {
            var deferred = $q.defer();
            pullBoards().then(function () {
                pullLists().then(function () {
                    pullMyCards().then(function () {
                        pullAllCards().then(function () {
                            deferred.resolve('update');

                        });
                    });
                });

            }); //runs pullLists() and  pullCards();

            return deferred.promise;
        };
        return {
            init: function (option) {

                if (!webStorage.has('trello_token')) {
                    if ($rootScope.mobil) {
                        var redirect = baseUrl + '/app/token?do=settoken';
                        var ref = window.open('https://trello.com/1/authorize?response_type=token&scope=read,write&key=' + key + '&redirect_uri=' + redirect + '&callback_method=fragment&expiration=never&name=Calendar+for+Trello', '_blank', 'location=no', 'toolbar=no');
                        ref.addEventListener('loadstart', function (event) {
                            if (event.url.indexOf('/#token=') > -1) {
                                token = event.url.substring((event.url.indexOf('/#token=') + 8));
                                ref.close();
                                firstInit().then(function () {
                                    update();
                                });
                            }
                        });
                    } else {
                        $window.location.href = 'https://trello.com/1/authorize?response_type=token&key=' + key + '&redirect_uri=' + encodeURI(baseUrl + '/app') + '%2Ftoken%3Fdo%3Dsettoken%26callback_method=fragment&scope=read%2Cwrite%2Caccount&expiration=never&name=Calendar+for+Trello';
                        //https://trello.com/1/authorize?response_type=token&key=           &redirect_uri=                          %2F%23%2Ftoken%3Fdo%3Dsettoken%26callback_method=fragment&scope=read%2Cwrite%2Caccount&expiration=never&name=Calendar+for+Trello
                        firstInit().then(function () {
                            update();
                        });
                    }
                } else {
                    if (data && option !== 1) {
                        // data already there
                        login.resolve(data);
                    } else {
                        //getData();
                        firstInit().then(function () {
                            update();
                        });
                    }
                }
                return login.promise;
            },

            refresh: function () {
                login = $q.defer();
                update();
                return login.promise;
            },

            remove: function () {
                data = null;
                webStorage.set('trello_token', null);
            },

            refreshAll: function () {
                login = $q.defer();
                updateAll();
                return login.promise;
            },

            updateDate: function () {
                $rootScope.$broadcast('refresh');
            },
            //toDo updateColor from new storage
            updateColor: function (boardId) {
                //var cards = data[1].data;
                //cards.forEach(function (entry) {
                //    if (localStorageService.get('boardColors') !== false) {
                //        if (entry.idBoard === boardId) {
                //            for (var i = 0; i < localStorageService.get('Boards').length; i++) {
                //                if (localStorageService.get('Boards')[i].id === boardId) {
                //                    entry.color = {'background-color': localStorageService.get('Boards')[i].color};
                //                }
                //            }
                //        }
                //    }
                //});
                console.log('updateColor ToDo', boardId);
            }
        };
    }
)
;