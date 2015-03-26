angular.module('starter.month').factory('getCards', function() {
    var promise;
    var getCards = {
        async: function() {
            if ( !promise ) {
                // Wenn promis nicht gesetzt ist, mach das, sonst geb zurück.
                promise =  Trello.get("members/me/cards", function (response) {
                    console.log(response);
                    return response;
                })
            }
            // Return the promise to the controller
            return promise;
        }
    };
    return getCards;
});






angular.module('starter.month').factory('getBoards', function() {
    var promise;
    var getBoards = {
        async: function() {
            if ( !promise ) {
                // Wenn promis nicht gesetzt ist, mach das, sonst geb zurück.
                promise =  Trello.get("members/me/boards", function (response) {
                    console.log(response);
                    return response;
                })

            }
            // Return the promise to the controller
            return promise;
        }
    };
    return getBoards;
});