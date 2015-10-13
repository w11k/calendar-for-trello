'use strict';
angular.module('trelloCal').controller('AppCtrl', function ($scope, $rootScope, ngProgress, initService, $mdSidenav, webStorage) {


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


        ngProgress.color('#CF513D');
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
