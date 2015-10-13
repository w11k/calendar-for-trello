'use strict';
angular.module('trelloCal').factory('setToken', /*ngInject*/  function (webStorage) {
    return {
        set: function (token) {
            webStorage.set('trello_token', token);
        }
    };
});