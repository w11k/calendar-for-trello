"use strict";
angular.module("w11kcal.app").factory("weekService", /*ngInject*/  function (initService) {


    var years = {}, i;







    return {
        buildYear: function (year, reload) {

            var cards = initService.print()[1].data;
            cards = _.groupBy(cards, 'dueDay');
            delete cards.undefined;




            var buildWeekDay = function (date) {
                date = moment(+date);
                var day = {
                    date:  date.format(),
                    cards: cards[new Date(date.format())],
                    //isToday: date.diff(moment(), "days", false)===0,
                    isToday: date.hour(0).minute(0).second(0).millisecond(0).isSame(moment().hour(0).minute(0).second(0).millisecond(0)),
                    weekday: date.format("dddd"),
                    kw: parseInt(date.format("W")),
                    year: date.format("GGGG"),
                    dateName: date.format("L"),
                    weekDay: date.format("dddd")
                };
                return day;
            };




            if(years[year] && !reload){
                // if year is already rendered and no reload forced , return previously rendered data
                return years[year];
            }
            var days = [];
            var day = new Date(year, 0, 1);
            for (i= 1; i <= 31; i++) {
                days.push(buildWeekDay(new Date(year-1,11,i)));
            }
            while (day.getFullYear() === year) {
                days.push(buildWeekDay(+day));
                day.setDate(day.getDate() + 1);
            }
            for (i= 1; i <= 31; i++) {
                days.push(buildWeekDay(new Date(year+1,0,i)));
            }
            years[year] = _.groupBy(days, 'year')[year];
            return years[year];
        }
    };

});
