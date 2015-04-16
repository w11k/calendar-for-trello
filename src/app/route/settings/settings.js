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
               /* 'isActive': function (demoSaveService){
                    if(demoSaveService.print()){
                        // User is already logged in - prevent reloading requests
                        // ToDo
                    }
                },*/
                'asInitService':function (initService){
                    return initService.init();
                }
            }
        });
});







angular.module('w11kcal.app.settings').run(function () {
});

angular.module('w11kcal.app.settings').controller('settingsCtrl', /*ngInject*/ function ($scope, $state,demoSaveService,localStorageService,$rootScope) {

    $scope.auth = function () {
        $state.go("app.month")

    };

    if(demoSaveService.print()){
        $scope.login = true;
    }


    var refresh = localStorageService.get("refresh") == "true";
    var boardColors = localStorageService.get("boardColors") == "true";
    $scope.settingsList = [
        { id: "refresh" ,text: "enable auto refresh", checked: refresh },
        { id:"boardColors", text: "enable board color", checked: boardColors }
    ];
    $scope.pushNotificationChange = function(item) {
        localStorageService.set(item.id, item.checked)
        $rootScope.$broadcast('settings-changed');
    };



});








