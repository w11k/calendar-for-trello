'use strict';

(function() {



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
        'trelloCal.settings',

        // Other


        'trelloCal.errorLogging',
        'trelloCal.analytics'


    ]);


    module.constant('AppKey', '41485cd87d154168dd6db06cdd3ffd69');
    //module.constant('baseUrl', 'http://localhost:9000');
    module.constant('baseUrl', 'http://trello-calendar.w11k.de');




    module.config(/*ngInject*/ function ( $urlRouterProvider, $stateProvider,localStorageServiceProvider, $mdThemingProvider) {


        $mdThemingProvider.theme('Indigo')
            .primaryPalette('blue')
            .accentPalette('green');


        localStorageServiceProvider
            .setPrefix('w11ktrello')
            .setStorageType('localStorage');

        $stateProvider


            .state('week', {
                url: '/week',
                views: {
                    'header': {
                        abstract: true,
                        templateUrl: 'partials/header.html',
                        controller: 'headerCtrl'

                    },
                    'sidebar':{
                        abstract: true,
                        templateUrl: 'partials/sidebar.html',
                        controller: 'headerCtrl'
                    },

                    'content': {
                        templateUrl: 'route/week/week.html',
                          controller: 'weekCtrl',
                        data: {
                            pageTitle: 'Week View'
                        }
                    }
                }
                ,
                resolve: {
                    'asInitService':function (initService) {

                        return initService.init();
                    }
                }
            })
            .state('stream', {
                url: '/stream',
                views: {
                    'header': {
                        abstract: true,
                        templateUrl: 'partials/header.html',
                        controller: 'headerCtrl'

                    },
                    'sidebar':{
                        abstract: true,
                        templateUrl: 'partials/sidebar.html',
                        controller: 'headerCtrl'
                    },

                    'content': {
                        templateUrl: 'route/stream/stream.html',
                        controller: 'streamCtrl',
                        data: {
                            pageTitle: 'Week View'
                        }
                    }
                }
                ,
                resolve: {
                    'init':function ( streamService) {
                        return streamService.get();
                    }

                }
            })
            .state('settings', {
                url: '/settings',
                views: {
                    'header': {
                        abstract: true,
                        templateUrl: 'partials/header.html',
                        controller: 'headerCtrl'

                    },
                    'sidebar':{
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
                    }
                }
                ,
                resolve: {
                    'asInitService':function (initService) {

                        return initService.init();
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
                    'sidebar':{
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
                    'setToken': function (setToken,$stateParams,$location){
                        setToken.set($stateParams.token);

                        delete $location.$$search.token;
                        delete $location.$$search.do;
                        $location.path('/');
                    }
                }
            });


        if(localStorage.getItem('w11ktrello.startMonth') === true || localStorage.getItem('w11ktrello.startMonth') === null) {
            $urlRouterProvider.otherwise('/month');
        } else {
            $urlRouterProvider.otherwise('/week');

        }

        if(!localStorage.getItem('w11ktrello.boardColors')) {
            localStorage.setItem('w11ktrello.boardColors', false);
        }

    });


    module.run(/*ngInject*/ function ( $location, $rootScope) {
        if($location.$$protocol !== 'http') {
            $rootScope.mobil = true;
        }
    });







    module.controller('AppCtrl', function($scope, $rootScope, ngProgress    ) {

        ngProgress.color('#C5CAE9');
        $rootScope.$on('$stateChangeSuccess', function () {
                ngProgress.complete();
            });
        $rootScope.$on('$stateChangeStart', function () {
                ngProgress.start();
            });

    });


    module.controller('headerCtrl', function($scope,$mdSidenav,$state, initService, $window, localStorageService,$location) {

        if(initService.print()) {
            $scope.name = initService.print()[0].data.fullName;
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



        $scope.goTo = function(target) {
            $location.path('/'+target);
            $scope.toggleSidenav('left');


        };

        $scope.logout = function () {
            initService.remove();
            $scope.login = false;
            $window.location.reload();
        };



        $scope.toHome = function () {
            if(localStorageService.get('startMonth') === false ) {
                $location.path('/week');
            } else {
                $location.path('/month')
            }
        };
    });


    module.directive('updateTitle', ['$rootScope', '$timeout',
        function($rootScope, $timeout) {
            return {
                link: function(scope, element) {

                    var listener = function(event, toState) {

                        var title = 'Default Title';
                        if (toState.data && toState.data.pageTitle) {
                            title = toState.data.pageTitle;
                        }

                        $timeout(function() {
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
            if (value.length <= max){
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




