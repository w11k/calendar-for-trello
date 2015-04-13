'use strict';
angular.module('w11kcal.app').factory('changeDate', /*ngInject*/  function($q,demoSaveService, AppKey,localStorageService, $http) {

    var token = localStorageService.get("trello_token");
    var data;
    var resourceFactory = {
        async: function(id, date) {

            data = {
                due: date,
                token: token,
                key:AppKey
            };

            return $http({
                method: "PUT",
                url: "https://api.trello.com/1/cards/"+id+"?key="+AppKey+"&token="+token,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: data
            })
        }
    };

    return resourceFactory;






});