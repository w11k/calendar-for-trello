"use strict";
angular.module("w11kcal.app").factory("weekService", /*ngInject*/  function (saveService) {



    var years = {};

    var cards = saveService.print()[1].data;
    cards = _.groupBy(cards, 'dueDay');
    delete cards.undefined;

    //
    //var buildADay = function (date, dayOff){
    //
    //    var day = {
    //        date: date,
    //        dayOff: dayOff,
    //        cards: cards[date],
    //        // isToday: "true/false",
    //        weekday: moment(new Date(date)).format("dddd")
    //    };
    //    return  day;
    //};
    //


    return {
        buildYear: function (year) {
            console.log("bulding for year:" + year);
            var days = [];
            var day = new Date(year,0,1);

            var getKW = function(d) {
                //var d = new Date(2015,2,20);
                d.setHours(0,0,0);
                d.setDate(d.getDate()+4-(d.getDay()||7));
                return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
            };

            while(day.getFullYear() === year) {
                days.push({
                    date: new Date(+day),
                    kw: getKW(new Date(+day))
                });
                day.setDate(day.getDate() + 1);
            }

            years[year] = days;

            return years[year];



        }

    };
});