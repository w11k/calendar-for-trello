"use strict";
angular.module("w11kcal.app").factory("saveService", /*ngInject*/  function (localStorageService) {
    var data;
    return {
        save: function (dat) {
            data = dat;
        },
        print: function () {
            return data;
        },
        remove: function () {
            data  = null;
            localStorageService.clearAll();
        },
        // ToDo
        update: function () {
            return;
        },
        refresh: function () {
            return;
        }
    };
});
