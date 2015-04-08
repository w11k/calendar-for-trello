'use strict';
angular.module('w11kcal.app').factory('archiveCard',  /*ngInject*/  function($q, Notification) {

    var resourceFactory = {
        async: function(id) {

            var d = $q.defer();
            var path = "cards/" + id + "/closed";
            var params = {
                value: true
            };
            var result = Trello.put(path, params, function() {
                console.log("archiviert");
                d.resolve(result);
            }, function() {
                console.log("error");
                d.reject()
            });
            return d.promise;
        }
    };
    return resourceFactory;




});