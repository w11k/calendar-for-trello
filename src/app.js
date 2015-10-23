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
        'ui-notification',
        'ngDragDrop',
        // Route

        'trelloCal.month',
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

    module.factory('offlineInterceptor', function ($q) {

        return {
            'request': function (config) {
                //promise that should abort the request when resolved.
                return config;
            },
            'response': function (response) {
                return response;
            },
            'responseError': function (rejection) {

                return $q.reject(rejection);

            }
        };
    });


})();




