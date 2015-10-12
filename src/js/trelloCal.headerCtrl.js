'use strict';
angular.module('trelloCal').controller('headerCtrl', function ($q, AppKey, webStorage, $http, ngProgress, changeDate, $mdDialog, $scope, $mdSidenav, $state, initService, $window, $location, $mdBottomSheet, $rootScope) {

    $scope.cards = [];
    var syncicon = '';
    if (webStorage.get('TrelloCalendarStorage').me.autorefresh) {
        if (webStorage.get('TrelloCalendarStorage').me.autorefresh === true) {
            syncicon = 'sync';
        }
        else {
            syncicon = 'sync_disabled';
        }
    }
    else {
        syncicon = 'sync_disabled';
    }


    var tempcards = [];
    for (var x in webStorage.get('TrelloCalendarStorage').cards.my) {
        tempcards.push(webStorage.get('TrelloCalendarStorage').cards.my[x]);
    }
    $scope.cards = tempcards;

    $rootScope.$on('rebuild', function () {
        var tempcards = [];
        for (var x in webStorage.get('TrelloCalendarStorage').cards.my) {
            tempcards.push(webStorage.get('TrelloCalendarStorage').cards.my[x]);
        }
        $scope.cards = tempcards;
    });
    /**filter for Overviews**/
    $scope.cardSelected = function (card) {
        if (_.find(webStorage.get('TrelloCalendarStorage').boards, {'id': card.idBoard})) {
            return _.find(webStorage.get('TrelloCalendarStorage').boards, {'id': card.idBoard}).enabled;
        }
        return false;
    };
    $scope.isOverdue = function (card) {
        if (card.due !== null && new Date(card.due) < new Date()) {
            return true;
        }
        return false;
    };
    $scope.isNoduedate = function (card) {
        if (!card.due) {
            //toDo add idMembers to card
            //for (var i = 0; i <= card.idMembers.length; i++) {
            //    if (card.idMembers[i] === $scope.id) {
            //        return true;
            //    }
            //}
            return true;
        }
        return false;
    };
    $scope.click = function (shortUrl) {
        $window.open(shortUrl);
    };

    /**Menu in Header**/
    $scope.actions = [
        {name: 'Auto-Refresh', icon: syncicon, identifier: 'refresh'},
        {name: 'Logout', icon: 'clear', identifier: 'logout'}
    ];
    $scope.more = [
        {name: 'Submit Feature Request', icon: 'wb_incandescent', identifier: 'feature'},
        {name: 'Report a Problem', icon: 'report_problem', identifier: 'bug'},
        {name: 'Delete all Settings', icon: 'delete', identifier: 'reset'}
    ];
    $scope.listItemClick = function (identifier) {
        var url = 'https://github.com/w11k/trello-calendar';
        switch (identifier) {
            case 'logout':
                $scope.logout();
                break;
            case 'refresh':
                var storage = webStorage.get('TrelloCalendarStorage');
                storage.me.autorefresh = !storage.me.autorefresh;
                webStorage.set('TrelloCalendarStorage', storage);
                if (storage.me.autorefresh === true) {
                    syncicon = 'sync';
                }
                else {
                    syncicon = 'sync_disabled';
                }
                $scope.actions = [
                    {name: 'Auto-Refresh', icon: syncicon, identifier: 'refresh'},
                    {name: 'Logout', icon: 'clear', identifier: 'logout'}
                ];
                break;
            case 'feature':
                window.open(url, '_blank');
                break;
            case 'bug':
                window.open(url, '_blank');
                break;
            case 'reset':
                webStorage.remove('TrelloCalendarStorage');
                $window.location.reload();
                break;
        }
        $mdBottomSheet.hide(identifier);
    };

    /**welcome Text**/
    if (webStorage.get('TrelloCalendarStorage').me) {
        $scope.name = webStorage.get('TrelloCalendarStorage').me.fullName;
        $scope.id = webStorage.get('TrelloCalendarStorage').me.id;
    } else {
        $scope.name = 'please login';
    }

    $scope.toggleSidenav = function (menuId) {
        $mdSidenav(menuId).toggle();
    };

    $scope.closeSidenav = function (menuId) {
        $mdSidenav(menuId).close();
    };

    $scope.openSidenav = function (menuId) {
        $mdSidenav(menuId).open();
    };

    $scope.goTo = function (target) {
        $location.path('/' + target);
        $scope.toggleSidenav('left');

    };

    $scope.sortableOptions = {
        receive: function (e, ui) {
            var id = ui.item[0].children[1].id.split('-')[0];
            ngProgress.start();
            var str = e.target.id + ui.item[0].children[1].id.split('-')[1];
            var newStr = [];

            angular.forEach(str.split(','), function (value) {
                newStr.push(parseInt(value));
            });
            if (!newStr[3]) {
                newStr[3] = 12;
                newStr.push(0);
                newStr.push(0);
            }
            var targetDate = new Date(newStr[0], newStr[1] - 1, newStr[2], newStr[3], newStr[4]);

            changeDate.async(id, targetDate).then(function () {
                    initService.updateDate(id, targetDate);
                    ngProgress.complete();
                },
                function () {
                    var dialog = function () {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .parent(angular.element(document.body))
                                .title('Oops, something went wrong.')
                                .content('please check your connection and reload this page')
                                .ariaLabel('Connection Error')
                                .ok('reload')
                            //  .targetEvent(ev)
                        ).then(function () {
                                changeDate.async(ui.item[0].firstElementChild.id.split('-')[0], targetDate).then(function () {
                                    // user is only, successfull
                                }, function () {
                                    dialog();

                                });
                            });
                    };
                    dialog();
                });

        },
        placeholder: 'card',
        connectWith: '.dayCards'

    };

    $scope.logout = function () {
        initService.remove();
        $scope.login = false;
        $window.location.reload();
    };

    $scope.toHome = function () {
        $location.path('/app/month');

    };

    $scope.openCardOverdued = function () {
        if ($scope.overduedHeader === {} || !$scope.overduedHeader) {
            $scope.overduedHeader = {'background-color': '#CF513D'};
            $scope.overduedIcon = {fill: 'white'};
            $scope.overduedTitle = {color: 'white'};
            $scope.overduedContent = {height: 'auto'};
            //$scope.overduedContent = {'max-height': '160px',height:'auto','overflow-y':'scroll'};
        }
        else {
            $scope.overduedHeader = null;
            $scope.overduedIcon = null;
            $scope.overduedTitle = null;
            $scope.overduedContent = null;

        }
    };
    $scope.openCardnoDue = function () {
        if ($scope.nodueHeader === {} || !$scope.nodueHeader) {
            $scope.nodueHeader = {'background-color': '#42548E'};
            $scope.nodueIcon = {fill: 'white'};
            $scope.nodueTitle = {color: 'white'};
            $scope.nodueContent = {height: 'auto'};

        }
        else {
            $scope.nodueHeader = null;
            $scope.nodueIcon = null;
            $scope.nodueTitle = null;
            $scope.nodueContent = null;

        }
    };


});
