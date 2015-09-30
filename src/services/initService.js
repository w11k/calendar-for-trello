'use strict';
angular.module('trelloCal').factory('initService', /*ngInject*/  function ($q, webStorage, $http, $mdDialog, $rootScope, localStorageService, $window, baseUrl, AppKey) {

        var key = AppKey;
        var token = localStorageService.get('trello_token');
        var login, me, boards, data, cards, colors;
        login = $q.defer();
        var allCards = {
            withDue: [],
            withoutDue: []
        };

        /*
         *Init variables
         */
        var version = '0.1.25';
        var boardColors = true;
        var observer = true;
        /*
         *firstInit pulls the userinformation and board colors
         * fields: fullName, id  fields: color,id,...
         * */
        var firstInit = function () {
            if (!webStorage.has('TrelloCalendarStorage')) {
                webStorage.set('TrelloCalendarStorage', {});
            }
            var TrelloCalendarStorage = webStorage.get('TrelloCalendarStorage');
            me = $http.get('https://api.trello.com/1/members/me?fields=fullName&key=' + key + '&token=' + token);
            colors = $http.get('https://api.trello.com/1/members/me/boardBackgrounds?key=' + key + '&token=' + token);
            $q.all([me, colors]).then(function (responses) {
                TrelloCalendarStorage.me = responses[0].data;
                TrelloCalendarStorage.colors = _.indexBy(responses[1].data, 'id');
                TrelloCalendarStorage.me.observer = observer;
                TrelloCalendarStorage.me.boardColors = boardColors;
                TrelloCalendarStorage.me.version = version;
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
                pullBoards();
            });

        };
        /*
         *pullBoards pulls open Boards from Trello
         *fields: name, shortUrl, id, prefs{background,backgroundColor,...}
         * */
        var pullBoards = function () {
            var TrelloCalendarStorage = webStorage.get('TrelloCalendarStorage');
            $http.get('https://api.trello.com/1/members/me/boards/?fields=name,shortUrl,prefs&filter=open&key=' + key + '&token=' + token).then(function (responses) {
                TrelloCalendarStorage.boards = _.indexBy(responses.data, 'id');
                webStorage.set('TrelloCalendarStorage', TrelloCalendarStorage);
                pullLists();
                pullCards();

            });
        };
        /*
         *pullLists pulls open Lists from Trello
         *fields: id, name
         * */
        var pullLists = function () {
            var TrelloCalendarStorage = webStorage.get('TrelloCalendarStorage');
            var listRequests = [];
            var alllists = [];
            _.forEach(TrelloCalendarStorage.boards, function (board) {
                listRequests.push($http.get('https://api.trello.com/1/boards/' + board.id + '/lists/?fields=name&filter=open&key=' + key + '&token=' + token));
                //    .then(function (responses) {
                //lists=lists.concat(responses.data);
            });
            $q.all(listRequests).then(function (responses) {
                _.forEach(responses, function (lists) {
                    alllists = alllists.concat(lists.data);
                });
                TrelloCalendarStorage.lists = _.indexBy(alllists, 'id');
                webStorage.set('TrelloCalendarStorage', TrelloCalendarStorage);
            });
        };
        /*
         *switches between pull my/all Cards
         */
        var pullCards = function () {
            var TrelloCalendarStorage = webStorage.get('TrelloCalendarStorage');
            if (TrelloCalendarStorage.me.observer) {
                pullAllCards();
            }
            else {
                pullMyCards();
            }
        };
        /*
         *pullMyCards pulls open Cards from Trello
         *if me/observer is false
         *fields: id, name,idList,dateLastActivity,shortUrl,due,idBoard
         * */
        var pullMyCards = function () {
            var TrelloCalendarStorage = webStorage.get('TrelloCalendarStorage');
            $http.get('https://api.trello.com/1/members/me/cards/?fields=idList,name,dateLastActivity,shortUrl,due,idBoard&filter=open&key=' + key + '&token=' + token).then(function (responses) {
                TrelloCalendarStorage.cards.my = _.indexBy(responses.data, 'id');
                webStorage.set('TrelloCalendarStorage', TrelloCalendarStorage);
            });
        };
        /*
         *pullAllCards pulls open Cards from Trello
         *if me/observer is true
         *fields: id, name,idList,dateLastActivity,shortUrl,due,idBoard
         * */
        var pullAllCards = function () {
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
                TrelloCalendarStorage.cards.all = _.indexBy(allCards, 'id');
                webStorage.set('TrelloCalendarStorage', TrelloCalendarStorage);
            });
        };


        /*
         * Collect profil information + boards
         * go through all boards and collect cards (since we can't get all cards directly)
         * sort either in allCards.withDue or allCards.withoutDue
         * */

        var pullAll = function () {
            var token = localStorageService.get('trello_token');

            me = $http.get('https://api.trello.com/1/members/me?key=' + key + '&token=' + token);
            boards = $http.get('https://api.trello.com/1/members/my/boards/?filter=open&key=' + key + '&token=' + token);

            $q.all([me, boards])
                .then(function (responses) {
                    var boards = _.indexBy(responses[1].data, 'id');
                    var cardRequests = [];
                    var listRequests = [];

                    _.forEach(boards, function (board) {
                        cardRequests.push($http.get('https://api.trello.com/1/boards/' + board.id + '/cards/?key=' + key + '&token=' + token));
                        $http.get('https://api.trello.com/1/boards/' + board.id + '/lists/?key=' + key + '&token=' + token).then(function (response) {
                            _.forEach(response.data, function (list) {
                                listRequests.push(list);
                            });
                        }, function (error) {
                            console.log('List-Request-Error: ', error);
                        });

                    });
                    $q.all(cardRequests).then(function (response) {
                        _.forEach(response, function (cards) {
                            cards.data.forEach(function (entry) {
                                entry.waiting = false;
                                entry.boardName = boards[entry.idBoard].name;
                                entry.boardUrl = boards[entry.idBoard].url;

                                if (localStorageService.get('TrelloData')) {
                                    if (entry.due !== null) {
                                        var withDue = _.indexBy(localStorageService.get('TrelloData')[1].data.withDue, 'id');
                                        if (withDue[entry.id] && withDue[entry.id].listName) {
                                            entry.listName = (withDue[entry.id].listName);
                                        }
                                        else {
                                            entry.listName = ('**********');
                                        }
                                    }
                                    else {
                                        var withoutDue = _.indexBy(localStorageService.get('TrelloData')[1].data.withoutDue, 'id');
                                        if (withoutDue[entry.id] && withoutDue[entry.id].listName) {
                                            entry.listName = (withoutDue[entry.id].listName);
                                        }
                                        else {
                                            entry.listName = ('**********');
                                        }
                                    }
                                }

                                if (_.indexBy(listRequests, 'id')[entry.idList]) {
                                    if (_.indexBy(listRequests, 'id')[entry.idList].name) {
                                        entry.listName = _.indexBy(listRequests, 'id')[entry.idList].name;

                                    }

                                }


                                //Farben aus localtorage holen wenn verfügbar
                                if (localStorageService.get('boardColors') !== false) {
                                    if (localStorageService.get('Boards')) {
                                        for (var i = 0; i < localStorageService.get('Boards').length; i++) {
                                            if (entry.idBoard === localStorageService.get('Boards')[i].id) {
                                                entry.color = {'background-color': localStorageService.get('Boards')[i].color};
                                            }
                                        }
                                    }

                                }

                                if (entry.due === null) {
                                    //Card has no due date
                                    allCards.withoutDue.push(entry);
                                    return;
                                }
                                var dueDay = entry.due;
                                entry.dueDay = new Date(new Date(dueDay).setHours(0, 0, 0, 0));
                                entry.due = new Date(entry.due);
                                allCards.withDue.push(entry);
                            });
                        });
                        responses[1].data = allCards;
                        data = responses;
                        responses.push(boards);
                        login.resolve(responses);
                        localStorageService.set('TrelloData', responses);
                    }, function (error) {
                        console.log('Card-Request-Error:', error);
                    });
                },
                function (error) {
                    // Something went wrong
                    console.log('me/board-Request-Error:', error);
                    // maybe auth?
                    if (error.status === 401) {
                        //log out, reload.
                        localStorageService.remove('trello_token');
                        $window.location.reload();
                    }
                });

        };
        var pullMy = function () {
            var token = localStorageService.get('trello_token');
            var listRequests = [];
            me = $http.get('https://api.trello.com/1/members/me?key=' + key + '&token=' + token);
            boards = $http.get('https://api.trello.com/1/members/my/boards/?filter=open&key=' + key + '&token=' + token);
            cards = $http.get('https://api.trello.com/1/members/me/cards?key=' + key + '&token=' + token);
            $q.all([me, cards, boards])
                .then(function (responses) {
                    var cards = responses[1].data;
                    var boards = _.indexBy(responses[2].data, 'id');

                    _.forEach(boards, function (board) {
                        $http.get('https://api.trello.com/1/boards/' + board.id + '/lists/?key=' + key + '&token=' + token).then(function (response) {
                            _.forEach(response.data, function (list) {
                                listRequests.push(list);
                            });
                        }, function (error) {
                            console.log('List-Request-Error: ', error);
                        });
                    });

                    cards.forEach(function (entry) {
                        entry.waiting = false;
                        entry.boardName = boards[entry.idBoard].name;
                        entry.boardUrl = boards[entry.idBoard].url;
                        ///
                        if (localStorageService.get('TrelloData')) {
                            if (entry.due !== null) {
                                var withDue = _.indexBy(localStorageService.get('TrelloData')[1].data.withDue, 'id');
                                if (withDue[entry.id].listName) {
                                    entry.listName = (withDue[entry.id].listName);
                                }
                                else {
                                    entry.listName = ('**********');
                                }
                            }
                            else {
                                var withoutDue = _.indexBy(localStorageService.get('TrelloData')[1].data.withoutDue, 'id');
                                if (withoutDue[entry.id].listName) {
                                    entry.listName = (withoutDue[entry.id].listName);
                                }
                                else {
                                    entry.listName = ('**********');
                                }
                            }
                        }

                        if (_.indexBy(listRequests, 'id')[entry.idList]) {
                            if (_.indexBy(listRequests, 'id')[entry.idList].name) {
                                entry.listName = _.indexBy(listRequests, 'id')[entry.idList].name;

                            }

                        }
                        //Farben aus localStorage holen wenn verfügbar
                        if (localStorageService.get('boardColors') !== false) {
                            if (localStorageService.get('Boards')) {
                                for (var i = 0; i < localStorageService.get('Boards').length; i++) {
                                    if (entry.idBoard === localStorageService.get('Boards')[i].id) {
                                        entry.color = {'background-color': localStorageService.get('Boards')[i].color};
                                    }
                                }
                            }
                        }
                        if (entry.due === null) {
                            allCards.withoutDue.push(entry);
                            entry.due = null;
                            return;
                        }
                        var dueDay = entry.due;
                        entry.dueDay = new Date(new Date(dueDay).setHours(0, 0, 0, 0));
                        entry.due = new Date(entry.due);
                        allCards.withDue.push(entry);
                    });
                    responses[1].data = allCards;
                    responses[2].data = boards;
                    responses.push(boards);
                    login.resolve(responses);
                    localStorageService.set('TrelloData', responses);
                    data = responses;

                },

                function (error) {
                    // Something went wrong
                    console.log(error);

                    // maybe auth?
                    if (error.status === 401) {
                        //log out, reload.
                        localStorageService.remove('trello_token');
                        $window.location.reload();
                    }
                });
        };
        var getData = function () {

            allCards = {
                withDue: [],
                withoutDue: []
            };
            if (localStorage.getItem('w11ktrello.observerMode') === 'false') {
                return pullMy();
            } else {
                return pullAll();
            }
        };
        var DialogController = function ($scope, $mdDialog) {
            $scope.hide = function () {
                $mdDialog.hide();
            };
            $scope.cancel = function () {
                $mdDialog.cancel();
            };
            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };
        };
        return {
            init: function (option) {

                if (!localStorageService.get('trello_token') || localStorageService.get('version') !== '0.1.25') {
                    localStorageService.set('version', '0.1.25');
                    $mdDialog.show({
                        controller: DialogController,
                        templateUrl: 'partials/StartDialog.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true
                    }).then(function () {
                        if (!localStorageService.get('trello_token')) {
                            if ($rootScope.mobil) {
                                var redirect = baseUrl + '/#/token?do=settoken';
                                var ref = window.open('https://trello.com/1/authorize?response_type=token&scope=read,write&key=' + key + '&redirect_uri=' + redirect + '&callback_method=fragment&expiration=never&name=Calendar+for+Trello', '_blank', 'location=no', 'toolbar=no');
                                ref.addEventListener('loadstart', function (event) {
                                    if (event.url.indexOf('/#token=') > -1) {
                                        token = event.url.substring((event.url.indexOf('/#token=') + 8));
                                        ref.close();
                                        localStorageService.set('trello_token', token);
                                        getData();
                                    }
                                });

                            } else {
                                $window.location.href = 'https://trello.com/1/authorize?response_type=token&key=' + key + '&redirect_uri=' + encodeURI(baseUrl) + '%2F%23%2Ftoken%3Fdo%3Dsettoken%26callback_method=fragment&scope=read%2Cwrite%2Caccount&expiration=never&name=Calendar+for+Trello';

                            }

                        }
                        else {
                            if (data && option !== 1) {
                                // data already there
                                login.resolve(data);
                            } else {
                                getData();
                            }
                        }

                    });


                } else {
                    if (data && option !== 1) {
                        // data already there
                        login.resolve(data);
                    } else {
                        getData();
                    }
                }

                return login.promise;
            },

            refresh: function () {
                login = $q.defer();
                allCards = {
                    withDue: [],
                    withoutDue: []
                };
                if (localStorage.getItem('w11ktrello.observerMode') === 'false') {
                    pullMy();

                } else {
                    pullAll();
                }
                firstInit();


                return login.promise;
            },

            print: function () {
                return data;
            },

            boards: function () {

                if (data[2]) {
                    var prom = $q.defer();
                    prom.resolve(data[2]);
                    return prom;
                }

                else {
                    return $http.get('https://api.trello.com/1/members/me/boards?key=' + key + '&token=' + token);
                }
            },

            remove: function () {
                data = null;
                localStorageService.set('trello_token', null);
            },

            updateDate: function (cardId, due) {
                var card = _.find(data[1].data.withDue, function (chr) {
                    return chr.id === cardId;
                });
                card.badges.due = due;
                card.due = due;
                card.dueDay = new Date(new Date(due).setHours(0, 0, 0, 0));
                $rootScope.$broadcast('rebuild');
            },

            getCards: function () {
                return allCards;
            },


            updateColor: function (boardId) {
                var cards = data[1].data;
                cards.forEach(function (entry) {
                    if (localStorageService.get('boardColors') !== false) {
                        if (entry.idBoard === boardId) {
                            for (var i = 0; i < localStorageService.get('Boards').length; i++) {
                                if (localStorageService.get('Boards')[i].id === boardId) {
                                    entry.color = {'background-color': localStorageService.get('Boards')[i].color};
                                }
                            }
                        }
                    }
                });
            }
        };
    }
)
;