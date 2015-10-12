'use strict';

(function () {


    var module = angular.module('trelloCal', [

        // Dependencies

        'ngAnimate',
        'ngMaterial',
        'ui.sortable',
        'ui.router',
        'ngMdIcons',
        'LocalStorageModule',
        'ngSanitize',
        'ngProgress',
        'ui.select',
        'webStorageModule',
        // Route

        'trelloCal.month',
        'trelloCal.week',
        'trelloCal.stream',
        'trelloCal.boards',
        'trelloCal.settings',

        // Other


        'trelloCal.errorLogging',
        'trelloCal.analytics',
        'w11k.angular-seo-header'

    ]);

    // get current URL with IE FIX
    if (!window.location.origin) {
        window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    }

    module.constant('AppKey', '41485cd87d154168dd6db06cdd3ffd69');
    module.constant('baseUrl', window.location.origin);



    module.config(/*ngInject*/ function ($urlRouterProvider, $stateProvider, $mdThemingProvider, $locationProvider) {

        $mdThemingProvider.definePalette('TrelloBusinessBlue', {
            '50': 'EDEFF4',
            '100': 'D2D7E5',
            '200': 'B2B9D0',
            '300': '838FB5',
            '400': '6170A1',
            '500': '42548E',
            '600': '3E4D80',
            '700': '3A476F',
            '800': 'c62828',
            '900': '36405F',
            'A100': 'D2D7E5',
            'A200': 'B2B9D0',
            'A400': '6170A1',
            'A700': '3A476F',
            'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                                // on this palette should be dark or light
            'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
                '200', '300', '400', 'A100'],
            'contrastLightColors': undefined    // could also specify this if default was 'dark'
        });
        $mdThemingProvider.definePalette('TrelloYellow', {
            '50': 'FDFAE5',
            '100': 'FAF3C0',
            '200': 'F5EA92',
            '300': 'F3E260',
            '400': 'F5DD29',
            '500': 'F2D600',
            '600': 'E6C60D',
            '700': 'D9B51C',
            '800': 'CCA42B',
            '900': 'BD903C',
            'A100': 'F5DD29',
            'A200': 'F2D600',
            'A400': 'F5DD29',
            'A700': 'D9B51C',
            'contrastDefaultColor': 'dark',    // whether, by default, text (contrast)
            // on this palette should be dark or light
            'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
                '200', '300', '400', 'A100'],
            'contrastLightColors': undefined    // could also specify this if default was 'dark'
        });
        $mdThemingProvider.definePalette('TrelloGrey', {
            '50': 'F8F9F9',
            '100': 'EDEFF0',
            '200': 'E2E4E6',
            '300': 'D6DADC',
            '400': 'CDD2D4',
            '500': 'C4C9CC',
            '600': 'B6BBBF',
            '700': 'A5ACB0',
            '800': '959DA1',
            '900': '838C91',
            'A100': 'F8F9F9',
            'A200': 'EDEFF0',
            'A400': 'CDD2D4',
            'A700': 'A5ACB0',
            'contrastDefaultColor': 'dark',    // whether, by default, text (contrast)
            // on this palette should be dark or light
            'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
                '200', '300', '400', 'A100'],
            'contrastLightColors': undefined    // could also specify this if default was 'dark'
        });
        $mdThemingProvider.definePalette('TrelloRed', {
            '50': 'FBEDEB',
            '100': 'F5D3CE',
            '200': 'EFB3AB',
            '300': 'EC9488',
            '400': 'EF7564',
            '500': 'CF513D',
            '600': 'CF513D',
            '700': 'B04632',
            '800': '933B27',
            '900': '6E2F1A',
            'A100': 'F5D3CE',
            'A200': 'EFB3AB',
            'A400': 'EF7564',
            'A700': 'B04632',
            'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
            // on this palette should be dark or light
            'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
                '200', '300', '400', 'A100'],
            'contrastLightColors': undefined    // could also specify this if default was 'dark'
        });
        $mdThemingProvider.theme('default')
            .primaryPalette('TrelloBusinessBlue')
            .accentPalette('TrelloBusinessBlue')
            .warnPalette('TrelloRed')
            .backgroundPalette('TrelloGrey');


        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true);
        $stateProvider
            .state('trello', {
                url: '',
                views: {
                    //This view contains elements that are common to the welcome and index states
                    'headerView': {
                        templateUrl: 'header.tpl.html'
                    }
                },
                data: {
                    head: {
                        title: 'Month',
                        robots: 'index,follow',
                        canonical: 'https://www.calendar-for-trello.com',
                    }
                }
            })
            .state('trello.welcome', {
                url: '/',
                views: {
                    'mainView@trello': {
                        templateUrl: 'welcome.tpl.html',
                        controller: function ($scope, webStorage, $location) {
                            //Controller in the abstract state is used only to set "global" elements for the state and the sub-states
                            $scope.voice = 'Welcome to trello cal, this is our app!';
                            $scope.menu = [{
                                state: 'trello.app.month',
                                name: 'Go to the app'
                            }];
                            if (webStorage.has('trello_token')) {
                                $location.path('/app/month');
                            }
                        }
                    }
                },
                data: {
                    head: {
                        title: 'Month',
                        robots: 'index,follow',
                        canonical: 'https://www.calendar-for-trello.com',
                    }
                }
            })
            .state('trello.app', {
                url: '/app',
                views: {
                    'mainView@trello': {
                        abstract: true,
                        templateUrl: 'trello.html',
                        controller: function () {
                        }
                    }
                },
                data: {
                    head: {
                        title: 'Month',
                        robots: 'index,follow',
                        canonical: 'https://www.calendar-for-trello.com',
                    }
                }
            })
            .state('trello.app.month', {
                url: '/month',
                views: {
                    'header@trello.app': {
                        abstract: true,
                        templateUrl: 'partials/header.html',
                        controller: 'headerCtrl'

                    },
                    'sidebar@trello.app': {
                        abstract: true,
                        templateUrl: 'partials/sidebar.html',
                        controller: 'headerCtrl'
                    },

                    'content@trello.app': {
                        templateUrl: 'route/month/month.html',
                        controller: 'monthCtrl',
                        data: {
                            pageTitle: 'Month View'
                        }
                    },
                    'search@trello.app': {
                        abstract: true,
                        templateUrl: 'partials/cardSearch.html',
                        controller: 'headerCtrl'
                    }
                },
                resolve: {
                    'asInitService': function (initService) {
                        return initService.init();
                    },
                    'getExistingBoardColors': function (localStorageService) {
                        return localStorageService.get('Boards');
                    }
                },
                data: {
                    head: {
                        title: 'Month',
                        robots: 'index,follow',
                        canonical: 'https://www.calendar-for-trello.com',
                    }
                }
            })
            .state('trello.app.settings', {
                url: '/settings',
                views: {
                    'header@trello.app': {
                        abstract: true,
                        templateUrl: 'partials/header.html',
                        controller: 'headerCtrl'

                    },
                    'sidebar@trello.app': {
                        abstract: true,
                        templateUrl: 'partials/sidebar.html',
                        controller: 'headerCtrl'
                    },

                    'content@trello.app': {
                        templateUrl: 'route/settings/settings.html',
                        controller: 'settingsCtrl',
                        data: {
                            pageTitle: 'Week View'
                        }
                    },
                    'search@trello.app': {
                        abstract: true,
                        templateUrl: 'partials/cardSearch.html',
                        controller: 'headerCtrl'
                    }
                },
                resolve: {
                    'asInitService': function (initService) {

                        return initService.init();
                    }
                },
                data: {
                    head: {
                        title: 'Settings',
                        robots: 'index,follow',
                        canonical: 'https://www.calendar-for-trello.com/settings',
                    }
                }

            })
            .state('trello.app.about', {
                url: '/about',
                views: {
                    'header@trello.app': {
                        abstract: true,
                        templateUrl: 'partials/header.html',
                        controller: 'headerCtrl'

                    },
                    'sidebar@trello.app': {
                        abstract: true,
                        templateUrl: 'partials/sidebar.html',
                        controller: 'headerCtrl'
                    },

                    'content': {
                        templateUrl: 'route/about/about.html',
                        //     controller: 'settingsCtrl',
                        data: {
                            pageTitle: 'About'
                        }
                    },
                    'search': {
                        abstract: true,
                        templateUrl: 'partials/cardSearch.html',
                        controller: 'headerCtrl'
                    }
                },
                data: {
                    head: {
                        title: 'About',
                        robots: 'index,follow',
                        canonical: 'https://www.calendar-for-trello.com/about',
                    }
                }

            })
            .state('trello.app.boards', {
                url: '/boards',
                views: {
                    'header': {
                        abstract: true,
                        templateUrl: 'partials/header.html',
                        controller: 'headerCtrl'
                    },
                    'sidebar': {
                        abstract: true,
                        templateUrl: 'partials/sidebar.html',
                        controller: 'headerCtrl'
                    },
                    'content': {
                        templateUrl: 'route/boards/boards.html',
                        controller: 'boardsCtrl',
                        data: {
                            pageTitle: 'Boards'
                        }
                    },
                    'search': {
                        abstract: true,
                        templateUrl: 'partials/cardSearch.html',
                        controller: 'headerCtrl'
                    }
                },
                data: {
                    head: {
                        title: 'Board Settings',
                        robots: 'index,follow',
                        canonical: 'https://www.calendar-for-trello.com/boards',
                    }
                }
            })
            .state('trello.app.token', {
                url: '/token?do&callback_method#token',
                views: {
                    'menuContent': {
                        templateUrl: 'route/month/month.html'
                    }
                },
                resolve: {
                    'setToken': function (setToken, $stateParams, $location) {
                        setToken.set($location.hash().split('=')[1]);
                        $location.url($location.path());
                        $location.path('/app/month');
                    }
                },
                data: {
                    head: {
                        title: 'token',
                        robots: 'index,follow',
                        canonical: 'https://www.calendar-for-trello.com',
                    }
                }
            });
    });

    module.run(/*ngInject*/ function ($location, $rootScope, webStorage) {
        if ($location.$$protocol !== 'http' && $location.$$protocol !== 'https') {
            $rootScope.mobil = true;
        }
        if (webStorage.has('trello_token') && $location.path() === '/') {
            $location.path('/app/month');
        }
    });

    module.controller('AppCtrl', function ($scope, $rootScope, ngProgress, initService, $mdSidenav, webStorage) {


        function toggleRight() {
            $mdSidenav('right').toggle().then(function () {
                $scope.keepOpen = !$scope.keepOpen;
                if ($scope.keepOpen) {
                    angular.element('md-backdrop.md-sidenav-backdrop-custom').removeClass('disabled');
                }
                else {
                    angular.element('md-backdrop.md-sidenav-backdrop-custom').addClass('disabled');
                }
            });
        }
        if (webStorage.has('TrelloCalendarStorage')) {
            ngProgress.color('#C5CAE9');
            $rootScope.$on('$stateChangeSuccess', function () {
                ngProgress.complete();
            });
            $rootScope.$on('$stateChangeStart', function () {
                ngProgress.start();
            });
            $scope.keyHandler = function (e) {
                var event = window.event ? window.event : e;
                if (event.keyCode === 114) {
                    console.log('reload');
                    $rootScope.$broadcast('reload');
                }
            };

            $rootScope.$on('reload', function () {
                ngProgress.start();
                initService.refresh().then(function () {
                    $rootScope.$broadcast('rebuild');
                    ngProgress.complete();
                });
            });
            $scope.keepOpen = false;

            $scope.toggleRight = toggleRight;

            $scope.checkClosingForm = function () {
                if (true) {
                    toggleRight();
                }
            };
        }

    });

    module.controller('headerCtrl', function ($q, AppKey, webStorage, $http, ngProgress, changeDate, $mdDialog, $scope, $mdSidenav, $state, initService, $window, $location, $mdBottomSheet, $rootScope) {

        if (webStorage.has('TrelloCalendarStorage')) {
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

            //toDo cards my/all in one or mark cards in all with my tag
            $rootScope.$on('rebuild', function () {
                var tempcards = [];
                for (var x in webStorage.get('TrelloCalendarStorage').cards.my) {
                    tempcards.push(webStorage.get('TrelloCalendarStorage').cards.my[x]);
                }
                $scope.cards = tempcards;


            });

            for (var x in webStorage.get('TrelloCalendarStorage').cards.my) {
                $scope.cards.push(webStorage.get('TrelloCalendarStorage').cards.my[x]);
            }
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

        }


    });

    module.directive('updateTitle', ['$rootScope', '$timeout',
        function ($rootScope, $timeout) {
            return {
                link: function (scope, element) {

                    var listener = function (event, toState) {

                        var title = 'Default Title';
                        if (toState.data && toState.data.pageTitle) {
                            title = toState.data.pageTitle;
                        }

                        $timeout(function () {
                            element.text(title);
                        }, 0, false);
                    };

                    $rootScope.$on('$stateChangeSuccess', listener);
                }
            };
        }
    ]);

    module.filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) {
                return '';
            }

            max = parseInt(max, 10);
            if (!max) {
                return value;
            }
            if (value.length <= max) {
                return value;
            }

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace !== -1) {
                    value = value.substr(0, lastspace);
                }
            }
            return value + (tail || ' …');
        };
    });
})();





