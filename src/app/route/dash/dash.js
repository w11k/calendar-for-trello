'use strict';
angular.module('starter.dash', []);


angular.module('starter').config(function($stateProvider) {

    $stateProvider
        .state('tab.dash', {
            url: '/dash',
            views: {
                'menuContent': {
                    templateUrl: 'route/dash/dash.html',
                    controller: 'DashCtrl'
                }
            }
        });
});




angular.module('starter').run(function() {});

angular.module('starter.dash').controller('DashCtrl', ['$scope', 'helloWorldFromFactory', function($scope, helloWorldFromFactory) {
    //console.log(helloWorldFromFactory.sayHello())


    var onAuthorize = function() {
        updateLoggedIn();
        var now = new Date();
        var nowISO = now.toISOString();
        // get me, get cards, get boards, match
        Trello.members.get("me", function(member) {
            $scope.member = member;
            Trello.get("members/me/cards", function(cards) {
                Trello.get("members/me/boards", function(boards) {

                    var boards = _.indexBy(boards, 'id')
                    cards.forEach(function(entry) {
                        entry.boardName = boards[entry.idBoard].name;
                        entry.boardUrl = boards[entry.idBoard].url;
                        if (entry.due == null) {
                            entry.status = "none";
                        } else {
                            /*
                             * Vergleichen der Dates
                             */
                            var startTimeDate = new Date(entry.due);
                            var now = new Date()
                            if (now > startTimeDate) {
                                entry.status = "expired"

                            } else {
                                entry.status = "open"
                            }

                            console.log(entry.status)
                        }

                    });
                     $scope.$apply();
                })
                console.log(cards)
                $scope.cards = cards

            })


        });

    };



    var updateLoggedIn = function() {
        var isLoggedIn = Trello.authorized();
        console.log(isLoggedIn)
        $scope.login = isLoggedIn;
        $("#loginPanel").toggle(!isLoggedIn);
        $("#cardPanel").toggle(isLoggedIn);

    };

    $scope.logout = function() {
        console.log("logge aus,")
        Trello.deauthorize();
        updateLoggedIn();
        $scope.cards = '';
    };



    Trello.authorize({
        interactive: false,
        success: onAuthorize
    });

    $scope.auth = function() {
        Trello.authorize({
            name: 'w11k Trello Kalender',
            type: "popup",
            scope: {
                read: true,
                write: true,
                account: true
            },
            success: onAuthorize
        })
    };

    $scope.archiveCard = function(id) {
        console.log("closing Card with id:" + id)
        Trello.put("cards/" + id + "/closed", function(cards) {
            console.log(cards)
        })
    }




    $scope.filterFn = function(row) {
        // Zeige nur Karten mit Zeitlimit
        if (row.status == "open") { //row.due != null (vor status implementation)
            return true;
        }
    };




}])


angular.module('starter.dash').factory('helloWorldFromFactory', function() {
    return {
        sayHello: function() { return "Hello, World!"; }
        };
    });
;