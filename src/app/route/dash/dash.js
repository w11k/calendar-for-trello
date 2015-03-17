'use strict';

angular.module('starter.dash', []);

angular.module('starter').config(function ($stateProvider) {

  $stateProvider
    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'route/dash/dash.html',
          controller: 'DashCtrl'
        }
      }
    });



});







angular.module('starter').run(function () {




//console.log(Trello.authorized())

/*

Trello.authorize({
    interactive:false,
    success: alreadyLoggedIn,
    error: NotAlreadyLoggedIn
});



var alreadyLoggedIn = function(){
    alert("sth")
}
var NotAlreadyLoggedIn = function(){
    alert("sth")
}
*/


});












angular.module('starter.dash').controller('DashCtrl', ['$scope', function($scope) {

/*



var alreadyLoggedIn = function(){
    alert("sth")
}





var OnSuccess = function()  {
   alert("success")

}

var OnError = function()  {
   alert("error")

}



 $scope.auth = function()  {
        Trello.authorize({
            type: "redirect",
            name: 'w11k Kalender',
            scope:{ read: true, write: true, account: true },
            persist: 'true',
            success: OnSuccess,
            error: OnError,
            expiration: '1hour'
        })
    }


*/
















var onAuthorize = function() {
    updateLoggedIn();
    $("#output").empty();

    Trello.members.get("me", function(member){
        //$("#name").text(member.fullName);

        var $cards = $("<div class='cardList'>")
            .text("Loading Cards...")
            .appendTo("#output");


                Trello.get("members/me/cards", function(cards) {
                    $scope.cards = cards
                    console.log(cards)
                               $scope.$apply();

                    })







    });

};

var updateLoggedIn = function() {
    var isLoggedIn = Trello.authorized();
        console.log(isLoggedIn)

    $("#loginPanel").toggle(!isLoggedIn);
    $("#cardPanel").toggle(isLoggedIn);
};

var logout = function() {
    Trello.deauthorize();
    updateLoggedIn();
};

Trello.authorize({
    interactive:false,
    success: onAuthorize
});

$scope.auth = function()  {
    Trello.authorize({
        type: "popup",
        success: onAuthorize
    })
};

$("#disconnect").click(logout);








  }]);












