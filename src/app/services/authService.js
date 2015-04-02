angular.module('starter.month').factory('authService', function($q) {
    var promise;
    var login;
    promise = $q.defer();
    var resourceFactory = {
        async: function() {

            console.log("async runs");

            if(!login){
                var onAuthorize = function(){
                    console.log("logged in");
                    promise.resolve(true);
                    login = true;
                };

                var onError = function(){
                    console.log("not logged in");
                    Trello.authorize({
                        type: "popup",
                        name: "w11k Trello",
                        expiration: "never",
                        scope: { read: true, write: true, account: true},
                        success: onAuthorize
                    })
                };

                Trello.authorize({
                    interactive:false,
                    success: onAuthorize,
                    error: onError
                });
            } else  {
                promise.resolve(login);
            }








            return promise.promise;

        },
        kill: function(){
            return "sth"
        }
    };

    return resourceFactory;
});
angular.module('starter.month').factory('deAuthService', function($q,$timeout) {
    var promise = $q.defer();
    var resourceFactory = {
        async: function() {
            Trello.deauthorize();
            $timeout(function () {
                promise.resolve("deauth");
                console.log(promise);
            },500);
            return promise.promise;

        }
    };
    return resourceFactory;
});
