'use strict';
angular.module('w11kcal.app').factory('archiveCard',  /*ngInject*/  function(AppKey, $http,localStorageService) {

    var token = localStorageService.get("trello_token");

    var data = {
        closed: true,
        token: token,
        key:AppKey
    };
    var resourceFactory = {
        async: function(id) {
            return $http({
                method: "PUT",
                url: "https://api.trello.com/1/cards/"+id,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: data
            });
        }};

    return resourceFactory;

});