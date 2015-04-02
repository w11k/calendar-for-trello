angular.module('starter').factory('getMembers', function($q) {

    var d = [];



    var resourceFactory = {
        board: function(id) {
            if(d[id] === undefined) {
                d[id] = $q.defer();
                var path = "boards/" + id + "/members";
                var params = {
                    value: true
                };
                var result = Trello.get(path, params, function() {
                    d[id].resolve(result);
                }, function() {
                    console.log("error");
                    d[id].reject()
                });
            }
            return d[id].promise;
        },

        getAll: function(){
            return d;
        }
    };
    return resourceFactory;
});