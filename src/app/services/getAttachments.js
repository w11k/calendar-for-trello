'use strict';
angular.module('w11kcal.app').factory('getAttachments', /*ngInject*/  function($q) {

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