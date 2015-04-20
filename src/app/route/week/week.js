'use strict';


angular.module('w11kcal.app.week', []);
angular.module('w11kcal.app.week').config(/*ngInject*/ function ($stateProvider) {
    $stateProvider
        .state('app.week', {
            url: '/week/{param}',
            views: {
                'menuContent': {
                    templateUrl: 'route/week/week.html',
                    controller: 'weekCtrl'
                }
            },
            resolve: {
                'asInitService':function (initService){
                    return initService.init();
                },isFreshView: function () {
                    return false;
                }
            }
        });
});







angular.module('w11kcal.app.week').run(function () {
});

angular.module('w11kcal.app.week').controller('weekCtrl', /*ngInject*/ function ( $scope,$location,  $state,demoSaveService, buildCalService,localStorageService,$rootScope) {

    if(!buildCalService.lastView()){

        // Week direkt angesurft - noch keine Woche definiert

    }

    $location.path('/app/week/params')


    $rootScope.$on('lastViewChangedTo', function(event, date) {
        console.log(date)
    });
});








