"use strict";
angular.module("w11kcal.app").factory("weekService", /*ngInject*/  function (saveService) {



    var years = {},  offset = {}, grouped,i;

    var cards = saveService.print()[1].data;
    cards = _.groupBy(cards, 'dueDay');
    delete cards.undefined;

    //
    //var buildADayWeek = function (date, dayOff){
    //
    //    var day = {
    //        date: date,
    //        dayOff: dayOff,
    //        cards: cards[date],
    //        // isToday: "true/false",
    //        weekday: moment(new Date(date)).format("dddd"),
    //        kw: 1231321321312312
    //    };
    //    return  day;
    //};
    // Today:
    //         var isToday = (new Date(+date).setHours(0,0,0,0) === new Date().setHours(0,0,0,0));



    return {
        buildYear: function (year) {
            var days = [];
            var day = new Date(year,0,1);

            var getKW = function(d) {
                //var d = new Date(2015,2,20);
                d.setHours(0,0,0);
                d.setDate(d.getDate()+4-(d.getDay()||7));
                return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
            };
            /**
             * Performance: getKW muss nur 1x aufgerufen werden
             * dann sagt es, 1 datum ist KW 1 oder 52/53
             * dann ++
             * bis?
             *
             * ggf. am ende nochmal?
             */
            while (day.getFullYear() === year) {
                days.push({
                    date: new Date(+day),
                    kw: getKW(new Date(+day)),
                    mixed: [new Date (+day).getFullYear(), getKW(new Date(+day))]
                });
                day.setDate(day.getDate() + 1);
            }



            grouped = _.groupBy(days, 'kw');
            offset.before = grouped[1].length;
            offset.behind = grouped[_.size(grouped)].length;

            console.log(offset);



            for (i = 0; i < offset.before; i++){
                console.log("1");
            }

            for (i = 0; i < offset.behind; i++){
                console.log("1");
            }

            years[year] = days;
            return years[year];
        }
    };
});