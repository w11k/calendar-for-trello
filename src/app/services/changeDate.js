'use strict';
angular.module('w11kcal.app').factory('changeDate', /*ngInject*/  function($q, dataService) {

    var resourceFactory = {
        async: function(id, date) {
            console.log("changeDate for:" + id + "to" + date );
            var d = $q.defer();
            var path = "cards/" +id+ "/";
            var params = {
                due: date
            };
            var result = Trello.put(path, params, function(){

                // ToDo: Hier müssen noch die Daten im Service geupdatet werden

                console.log("succes. date in trello changed.");
                console.log("now changing in Service...");

                dataService.update(id, "badges.due", date);



                d.resolve(result);
            }, function(){
                console.log("err");
                d.reject()
            });
            return d.promise;
        }
    };
    return resourceFactory;






});

