angular.module('starter').factory('getCards', function($q,$location) {
    /* var promise;
     var promise2;
     var getCards = {
     async: function() {
     if ( !promise ) {
     promise =  Trello.get("members/me/cards", function (response) {
     console.log("received cards");
     return response;
     })
     }
     if ( !promise2 ) {
     promise2 =  Trello.get("members/me/boards", function (response) {
     console.log("cards boards");
     return response;
     })
     }
     var result = $q.all([promise, promise2])
     .then(function(responsesArray) {
     return(responsesArray)
     });
     return result;
     }
     };
     return getCards;
     */

    /*
     var getFunction = function (){
     return "dab";

     };






     var user;

     function getUser() {
     // If we've already cached it, return that one.
     // But return a promise version so it's consistent across invocations
     if ( angular.isDefined( user ) ) return $q.when( user );

     // Otherwise, let's get it the first time and save it for later.
     //       $timeout(function () {

     return getFunction()
     .then( function( data ) {
     user = data;
     return user;
     });
     //       }, 2000);

     };

     // The public API
     return {
     getUser: getUser
     };
     */



    /*

     $timeout(function () {
     var getCards = function(){

     var api1 = $http.get('https://api.trello.com/1/members/me?key=41485cd87d154168dd6db06cdd3ffd69&token=ff7fe182f66be89dc004016c73bcec86e3fce2a2c4309ffada9e5cdb9293ec3d');
     var api2 = $http.get('https://api.trello.com/1/members/me?key=41485cd87d154168dd6db06cdd3ffd69&token=ff7fe182f66be89dc004016c73bcec86e3fce2a2c4309ffada9e5cdb9293ec3d');

     return $q.all([api1, api2])
     .then(function(responsesArray) {
     console.log(responsesArray);

     return(responsesArray)
     });

     };
     return getCards();
     }, 2000);


     */

    /* geht, macht halt nix

     var deferred = $q.defer();
     $timeout(function () {
     deferred.resolve('Hello!');
     }, 1000);

     return deferred.promise;

     */


/*
 * 1. Trello auth -> errFn wenn fehl -> dann Login
 * 2. get me, cards, boards
 * 3. Promise
 *
 */



    var deferred = $q.defer();
    var promise;
    var promise1;
    var promise2;
    var getCards = {
        async: function() {

            if ( !promise) {
                promise =  Trello.get("members/me", function (response) {
                    return response;
                })
            }
            if ( !promise1 ) {
                promise1 =  Trello.get("members/me/cards", function (response) {
                    return response;
                })
            }
            if ( !promise2 ) {
                promise2 =  Trello.get("members/me/boards", function (response) {
                    return response;
                })
            }
            var result = $q.all([promise, promise1, promise2])
                .then(function(responsesArray) {
                    return(responsesArray)
                });
            return result;
        }

    };

    deferred.resolve(getCards.async());
    return deferred.promise;


});

