/**
 * Created by can on 01.04.15.
 */
angular.module('starter').factory('testService', function($q,$timeout,$rootScope) {

    /*
     * Variablen definiern
     * return funktionen definieren
     * in ersten funktion daten einfügen
     * in der nächsten daten ausgeben
     * in der nächsten daten löschen
     * try..
     *
     *
     *
     * hat geklappt.
     *
     * die erste FN gibt ein promise zurück während get nur die daten ausgibt und rm removed
     */



    var data;
    var promise = $q.defer();
    var login;
    var getData = function(){




        console.log("getData start");
        var getter = $q.defer();
        $timeout(function(){
            data = "123";
            getter.resolve();
        },2000);

        return getter.promise;
    };


    return {
        promFn: function(){
            if(data){
                promise.resolve("yo");
            } else {
                getData().then(function(){
                    console.log("then erreicht")
                    promise.resolve();
                });
            }
            return promise.promise;
        },
        get: function(){
            return data;
        },
        remove: function(){
            data = null;

        }
    }



});
