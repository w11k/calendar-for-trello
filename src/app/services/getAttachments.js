angular.module('starter').factory('getAttachments', function($q) {

    var promise;
    var data;

    promise = $q.defer();
    var resourceFactory = {
        async: function(id) {
            var path = "cards/" + id + "/attachments";
            if(!data){
                data= Trello.get(path, function(result) {
                    promise.resolve(result);
                }, function() {
                    promise.reject()
                });
            } else  {
                promise.resolve(data);
            }
            return promise.promise;
        }
    };
    return resourceFactory;

});