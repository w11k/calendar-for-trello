'use strict';
angular.module('trelloCal').factory('setToken', /*ngInject*/  function (webStorage) {
    return {
        set: function (token) {
            //localStorageService.set('trello_token', token);
            webStorage.set('trello_token', token);
        }
    };
});