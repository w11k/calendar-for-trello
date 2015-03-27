angular.module('starter').factory('changeDate', function($q) {
    /*
     return {
     sayHello: function() { return "Hello, World!"; }
     };

     var resourceFactory = {
     async: function(id, date) {


     var d = $q.defer();
     var result = $http.get("https://api.trello.com/1/members/me/boards?key=41485cd87d154168dd6db06cdd3ffd69&token=000f9229204dc5679f293d01fbc761b6dce957d65e440fb3b6d55b8c91456cc8&9999").success(function() {
     $timeout(function () {
     d.resolve(result);
     }, 2000)
     });
     return d.promise;
     }
     };
     return resourceFactory;



     */

    var resourceFactory = {
        async: function(id, date) {
            var d = $q.defer();
            var path = "cards/" +id+ "/";
            var params = {
                due: date
            };
            var result = Trello.put(path, params, function(){
                console.log("success")
                d.resolve(result);
            }, function(){
                console.log("err")
            });
            return d.promise;
        }
    };
    return resourceFactory;






});

