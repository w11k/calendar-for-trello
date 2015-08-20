'use strict';
angular.module('trelloCal').factory('setToken', /*ngInject*/  function (localStorageService) {
    return {
        set: function (token) {
            localStorageService.set('trello_token', token);
        }
    };
});