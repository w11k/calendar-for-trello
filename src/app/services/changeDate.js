angular.module('starter').factory('changeDate', function($q) {

    var resourceFactory = {
        async: function(id, date) {
            var d = $q.defer();
            var path = "cards/" +id+ "/";
            var params = {
                due: date
            };
            var result = Trello.put(path, params, function(){
                console.log("success");
                d.resolve(result);
            }, function(){
                console.log("err");
                d.reject()
            });
            return d.promise;
        }
    };
    return resourceFactory;






});

