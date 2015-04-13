"use strict";
angular.module("w11kcal.app").factory("demoSaveService", /*ngInject*/  function (localStorageService) {
    var data;
    return {
        save: function (dat) {
            data = dat;
        },
        print: function () {
            return data;
        },
        remove: function () {
            console.log("unsetting data + login:");
            data  = null;
            localStorageService.clearAll();
        },
        // ToDo
        update: function () {
            return
        },
        refresh: function () {
            return
        }
    }
});
