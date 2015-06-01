'use strict';
angular.module('trelloCal').factory('streamService', /*ngInject*/  function ($q, $http,  $rootScope, localStorageService, baseUrl, AppKey, initService) {

    var key = AppKey;
    var token = localStorageService.get('trello_token');
    var request = $q.defer();
    var data;


    var sort = function (input) {
        data = [];
        _.forEach(input, function (item) {
            _.forEach(item.data, function (item){
                item.day =  new Date(item.date).setHours(0,0,0,0);
                item.sort =  new Date(item.date).getFullYear()+','+new Date(item.date).getMonth();
                item.month =  {
                    year : new Date(item.date).getFullYear(),
                 month: new Date(item.date).getMonth()
                };
                data.push(item);
            });
        });


        data = _.groupBy(data,'sort');

        return data;

    };

    return {
        get: function () {
            initService.init().then(function(initData){
                if(!data) {
                    var requests = [];
                    angular.forEach(initData[2].data, function(board) {
                        //requests.push($http.get('https://api.trello.com/1/boards/'+board.id+'/actions?key='+key+'&token='+token));
                        // ToDo: monthly limited
                        //https://api.trello.com/1/boards/55267ce7997450bb52ca8b21/actions?since=2015-05-19T11%3A08%3A42%2B00%3A00%0A&key=41485cd87d154168dd6db06cdd3ffd69&token=df89f735a3dec3595a81794e8b40781f1de5bb65ceb1bc651b2562db1d6828a8
                        requests.push($http({
                            method: 'GET',
                            url: 'https://api.trello.com/1/boards/'+board.id+'/actions?limit=2&key='+key+'&token='+token,
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }));
                    });
                    $q.all(requests)
                        .then(
                        function(results) {
                            results = sort(results);
                            request.resolve((results));
                            data = results;
                        },
                        function(errors) {
                            request.reject(errors);
                        });
                } else {
                    return data;
                }
            });
            return request.promise;
        }
    };
});