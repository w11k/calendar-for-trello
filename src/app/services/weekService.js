"use strict";
angular.module("w11kcal.app").factory("weekService", /*ngInject*/  function (saveService) {



    var years = {},  offset = {}, grouped, i, workDate;

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
        buildYear: function (year, kw) {
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


             workDate = new Date(+days[1].date);

            grouped = _.groupBy(days, 'mixed');



            // catch overhead
            // TOdo remove this overhead in days and years[year] !!!
            if (_.size(grouped) > kw) {
                console.log("cut");
                delete grouped[[year, 53]];
            }


            console.log(_.size(grouped));
            console.log(grouped);

            //offset.before = grouped[1].length;
            //offset.behind = grouped[_.size(grouped)].length;

            console.log(7-grouped[[year, 1]].length);
            console.log(7-grouped[[year, kw]].length);


            for (i = 0; i < offset.before; i++){
                workDate.setDate(workDate.getDate() - 1);
                console.log(workDate);
                //days.push(buildADay(new Date(days[].setHours(0,0,0,0)), true));

                    // if weekday is 1 push 7 days:
                }

            for (i = 0; i < offset.behind; i++){
                console.log("1");
            }

            years[year] = days;
            return years[year];
        }
    };
});