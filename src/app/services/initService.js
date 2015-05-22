'use strict';
angular.module('trelloCal').factory('initService', /*ngInject*/  function ($q, $http,  $rootScope, localStorageService, $window, baseUrl, AppKey) {

    var key = AppKey;
    var token = localStorageService.get('trello_token');
    var login, me, boards, cards, data;
    login = $q.defer();





    var getData = function () {
        me = $http.get('https://api.trello.com/1/members/me?key='+key+'&token='+token);
        boards = $http.get('https://api.trello.com/1/members/me/boards?key='+key+'&token='+token);
        cards = $http.get('https://api.trello.com/1/members/me/cards?key='+key+'&token='+token);

        $q.all([me, cards, boards])
            .then(function (responses) {
                var cards = responses[1].data;
                var boards = _.indexBy(responses[2].data, 'id');
                cards.forEach(function (entry) {
                    entry.waiting = false;
                    entry.boardName = boards[entry.idBoard].name;
                    entry.boardUrl = boards[entry.idBoard].url;
                    if (localStorageService.get('boardColors') !== false) {
                       entry.color = { 'background-color':boards[entry.idBoard].prefs.backgroundColor };

                    }
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
            },
            function (error){
                // Something went wrong
                console.log(error);

                // maybe auth?
                if (error.status === 401){
                    //log out, reload.
                    localStorageService.remove('trello_token');
                    $window.location.reload();
                }
            });
    };









    return {
        init: function (option) {
            if(!token) {
                /**
                 *  User is not logged in, if $rootScope.mobil = true he is on a mobile device,
                 *  else use simple redirect in the same window
                 */


                if($rootScope.mobil){
                    alert(localStorageService.get('trello_token'));
                    alert('rdy');
                    var redirect = baseUrl+'/#/token?do=settoken';
                    var ref = window.open('https://trello.com/1/authorize?response_type=token&key='+key+'&redirect_uri='+ redirect +'&callback_method=fragment&scope=read%2Cwrite%2Caccount&expiration=never&name=w11k+Trello', '_blank', 'location=yes');
                    ref.addEventListener('loadstop', function(event) {
                        console.log(event);
                        if (event.url.indexOf('/token=') > -1){
                             token = event.url.substring((event.url.indexOf('/token=')+7));
                            ref.close();
                            localStorageService.set('trello_token', token);
                            getData();
                        }
                    });


                } else {
                    $window.location.href ='https://trello.com/1/authorize?response_type=token&key='+key+'&redirect_uri='+encodeURI(baseUrl)+'%2F%23%2Ftoken%3Fdo%3Dsettoken%26callback_method=fragment&scope=read%2Cwrite%2Caccount&expiration=never&name=w11k+Trello';
                }
            } else {
            if(data && option !== 1) {
                // data already there
                login.resolve(data);
            } else {
                getData();
            }
            }
            return login.promise;
        },



        refresh: function () {

           var status = $q.defer();
           var me = $http.get('https://api.trello.com/1/members/me?key='+key+'&token='+token);
           var boards = $http.get('https://api.trello.com/1/members/me/boards?key='+key+'&token='+token);
           var cards = $http.get('https://api.trello.com/1/members/me/cards?key='+key+'&token='+token);


            $q.all([me, cards, boards])
                .then(function (responses) {
                    var cards = responses[1].data;
                    var boards = _.indexBy(responses[2].data, 'id');
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
        },



        print: function () {
            return data;
        },

        boards: function () {
            return data[2].data;
        },

        remove: function () {
            data = null;
            localStorageService.set('trello_token' ,null);
        },

        updateDate: function (cardId, due) {
          var card = _.find(data[1].data, function(chr) {
                return  chr.id === cardId;
            });
            card.badges.due = due;
            card.due = due;
            card.dueDay = new Date(new Date(due).setHours(0,0,0,0));
        }
    };
});