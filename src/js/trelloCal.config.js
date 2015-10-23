'use strict';
angular.module('trelloCal').config(/*ngInject*/ function ($httpProvider, $urlRouterProvider, $stateProvider, $mdThemingProvider, $locationProvider) {
    $httpProvider.interceptors.push('offlineInterceptor');


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
            }
        })
        .state('trello.welcome', {
            url: '/',
            views: {
                'mainView@trello': {
                    templateUrl: 'welcome.tpl.html'
                }
            },
            data: {
                head: {
                    title: 'Trello-Calendar',
                    robots: 'index,follow',
                    keywords: ['Trello', 'Calendar', 'all', 'boards', 'w11k', 'theCodeCampus', 'cards', 'calendar'],
                    description: 'The w11k Trello Calendar allows you to organize all cards of all boards in one calendar.',
                    canonical: 'https://www.calendar-for-trello.com'
                }
            }
        })
        .state('trello.app', {
            url: '/app',
            views: {
                'mainView@trello': {
                    abstract: true,
                    templateUrl: 'trello.html'
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
                    keywords: ['Trello', 'Calendar', 'all', 'boards', 'w11k', 'theCodeCampus', 'cards', 'calendar'],
                    description: 'The w11k Trello Calendar allows you to organize all cards of all boards in one calendar.',
                    canonical: 'https://www.calendar-for-trello.com/app/month'
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
                    keywords: ['Trello', 'Calendar', 'all', 'boards', 'w11k', 'theCodeCampus', 'cards', 'calendar'],
                    description: 'The w11k Trello Calendar allows you to organize all cards of all boards in one calendar.',
                    canonical: 'https://www.calendar-for-trello.com/app/settings'
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
                    keywords: ['Trello', 'Calendar', 'all', 'boards', 'w11k', 'theCodeCampus', 'cards', 'calendar'],
                    description: 'The w11k Trello Calendar allows you to organize all cards of all boards in one calendar.',
                    canonical: 'https://www.calendar-for-trello.com/app/about'
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
                    keywords: ['Trello', 'Calendar', 'all', 'boards', 'w11k', 'theCodeCampus', 'cards', 'calendar'],
                    description: 'The w11k Trello Calendar allows you to organize all cards of all boards in one calendar.',
                    canonical: 'https://www.calendar-for-trello.com/app/boards'
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
            }
        });
});
