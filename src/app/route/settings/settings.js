'use strict';
angular.module('w11kcal.app.settings', []);
angular.module('w11kcal.app.settings').config(/*ngInject*/ function ($stateProvider) {
    $stateProvider
        .state('app.settings', {
            url: '/settings',
            views: {
                'menuContent': {
                    templateUrl: 'route/settings/settings.html',
                    controller: 'settingsCtrl'
                }
            },
            resolve: {
                'asInitService':function (initService){
                    return initService.init();
                }
            }
        });
});


angular.module('w11kcal.app.settings').controller('settingsCtrl', /*ngInject*/ function ($scope, $state,initService,localStorageService,$rootScope) {

    $scope.auth = function () {
        $state.go("app.month");

    };

    if(initService.print()){
        $scope.login = true;
    }


    var refresh = localStorageService.get("refresh") === "true";
    var boardColors = localStorageService.get("boardColors") === "true";
    $scope.settingsList = [
        { id: "refresh" ,text: "enable auto refresh", checked: refresh },
        { id:"boardColors", text: "enable board color", checked: boardColors }
    ];
    $scope.pushNotificationChange = function(item) {
        localStorageService.set(item.id, item.checked);
        $rootScope.$broadcast('settings-changed');
    };



    $scope.options = [
        { label: 'Month', value: false },
        { label: 'Week', value: true }
    ];

    if(localStorageService.get("startWithWeek") === "true"){
        $scope.choice = $scope.options[1];
    } else {
        $scope.choice = $scope.options[0];
    }

    $scope.change = function (el) {
        localStorageService.set("startWithWeek", el.value);
    };
});








