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


    module.config(/*ngInject*/ function ($urlRouterProvider, $stateProvider, localStorageServiceProvider, $mdThemingProvider) {

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


        localStorageServiceProvider
            .setPrefix('w11ktrello')
            .setStorageType('localStorage');
        $stateProvider

            .state('month', {
                url: '/month',
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
                        templateUrl: 'route/month/month.html',
                        controller: 'monthCtrl',
                        data: {
                            pageTitle: 'Month View'
                        }
                    },
                    'search': {
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
                        canonical: 'https://www.calendar-for-trello.com/#/month',
                    }
                },
            })
            .state('settings', {
                url: '/settings',
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
                        templateUrl: 'route/settings/settings.html',
                        controller: 'settingsCtrl',
                        data: {
                            pageTitle: 'Week View'
                        }
                    },
                    'search': {
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
                        canonical: 'https://www.calendar-for-trello.com/#/settings',
                    }
                }

            })
            .state('about', {
                url: '/about',
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
                        canonical: 'https://www.calendar-for-trello.com/#/about',
                    }
                }

            })
            .state('boards', {
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
                        canonical: 'https://www.calendar-for-trello.com/#/boards',
                    }
                },
                resolve: {
                    'asInitService': function (initService) {

                        return initService.init();
                    },
                    'getExistingBoardColors': function (localStorageService) {
                        return localStorageService.get('Boards');
                    }

                }
            })
            .state('token', {
                url: '/token?do&token',
                views: {
                    'menuContent': {
                        templateUrl: 'route/month/month.html'
                    }
                },
                resolve: {
                    'setToken': function (setToken, $stateParams, $location) {
                        setToken.set($stateParams.token);

                        delete $location.$$search.token;
                        delete $location.$$search.do;
                        $location.path('/');
                    }
                },
                data: {
                    head: {
                        title: 'token',
                        robots: 'index,follow',
                        canonical: 'https://www.calendar-for-trello.com/#/month',
                    }
                }
            });

        if (!localStorage.getItem('w11ktrello.boardColors')) {
            localStorage.setItem('w11ktrello.boardColors', true);
        }
        if (localStorage.getItem('w11ktrello.startMonth') === 'false') {
            $urlRouterProvider.otherwise('/week');
        } else {
            $urlRouterProvider.otherwise('/month');
        }


        if (!localStorage.getItem('w11ktrello.observerMode')) {
            localStorage.setItem('w11ktrello.observerMode', false);
        }

    });


    module.run(/*ngInject*/ function ($location, $rootScope) {
        if ($location.$$protocol !== 'http' && $location.$$protocol !== 'https') {
            $rootScope.mobil = true;
        }
    });

    module.controller('AppCtrl', function ($scope, $rootScope, ngProgress, initService, $mdSidenav) {
        ngProgress.color('#C5CAE9');
        $rootScope.$on('$stateChangeSuccess', function () {
            ngProgress.complete();
        });
        $rootScope.$on('$stateChangeStart', function () {
            ngProgress.start();
        });


        $rootScope.$on('reload', function () {
            initService.refresh().then(function () {
                $rootScope.$broadcast('rebuild');
            });
        });
        $scope.keepOpen = false;


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

        $scope.toggleRight = toggleRight;

        $scope.checkClosingForm = function () {
            if (true) {
                toggleRight();
            }
        };

    });

    module.controller('headerCtrl', function ($q, $scope, $mdSidenav, $state, initService, $window, localStorageService, $location, $mdBottomSheet, $rootScope, AppKey, $http) {

        $rootScope.$on('reload', function () {
            $scope.cards = initService.getCards().withDue.concat(initService.getCards().withoutDue);
        });
        $scope.cards = initService.getCards().withDue.concat(initService.getCards().withoutDue);

        $scope.isOverdue = function (card) {
            if (card.dueDay < new Date()) {
                for (var i = 0; i <= card.idMembers.length; i++) {
                    if (card.idMembers[i] === $scope.id) {
                        return true;
                    }
                }

            }
            return false;
        };

        $scope.isNoduedate = function (card) {
            if (!card.due) {
                for (var i = 0; i <= card.idMembers.length; i++) {
                    if (card.idMembers[i] === $scope.id) {
                        return true;
                    }
                }
            }
            return false;
        };

        $scope.isComing = function (card) {
            if (card.dueDay > new Date()) {
                for (var i = 0; i <= card.idMembers.length; i++) {
                    if (card.idMembers[i] === $scope.id) {
                        return true;
                    }
                }
            }

            return false;
        };

        $scope.click = function (shortUrl) {
            $window.open(shortUrl);
        };

        $scope.actions = [
            {name: 'Refresh', icon: 'sync', identifier: 'refresh'},
            {name: 'Logout', icon: 'clear', identifier: 'logout'}
        ];
        $scope.more = [
            {name: 'Submit Feature Request', icon: 'wb_incandescent', identifier: 'feature'},
            {name: 'Report a Problem', icon: 'report_problem', identifier: 'bug'}
        ];
        $scope.listItemClick = function (identifier) {
            var url = 'https://github.com/w11k/trello-calendar';

            switch (identifier) {
                case 'logout':
                    $scope.logout();
                    break;
                case 'refresh':
                    $rootScope.$broadcast('reload');
                    break;
                case 'feature':
                    window.open(url, '_blank');
                    break;
                case 'bug':
                    window.open(url, '_blank');
                    break;
            }
            $mdBottomSheet.hide(identifier);
        };

        if (initService.print()) {
            $scope.name = initService.print()[0].data.fullName;
            $scope.id = initService.print()[0].data.id;
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

        $scope.logout = function () {
            initService.remove();
            $scope.login = false;
            $window.location.reload();
        };

        $scope.toHome = function () {
            if (localStorageService.get('startMonth') !== false) {
                $location.path('/month');
            } else {
                $location.path('/week');
            }
        };

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





