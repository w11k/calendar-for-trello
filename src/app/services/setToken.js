"use strict";
angular.module("w11kcal.app").factory("setToken", /*ngInject*/  function (localStorageService) {
    return {
        set: function (token) {
            localStorageService.set("trello_token", token)
        }
    }
});