"use strict";
angular.module("w11kcal.app").factory("buildCalService", /*ngInject*/  function (saveService) {

    /**
     * returns amount of days for month in year
     */

    var config = {
        startOffset: null,
        endOffSet: null
    };



    var cards = saveService.print()[1].data;
    cards = _.groupBy(cards, 'dueDay');
    delete cards.undefined;


    var buildADay = function (date, dayOff){

        var day = {
            date: date,
            dayOff: dayOff,
            cards: cards[date],
           // isToday: "true/false",
            weekday: moment(new Date(date)).format("dddd")
        };
        return  day;
    };



    return {
        build: function (inDate) {
            var days = [];

            function getDaysInMonth (year, month) {
                var date = new Date(year, month, 1);
                /**
                 * get start - offset
                 */
                var runs = moment(date).isoWeekday();
             //   console.log(runs);




                if (runs === 1) {
                    // if week starts with monday, add 7 days
                    runs = 7;
                }
                config.startOffset = runs-1;
                var workDate = new Date(date-1);
                for (var d = 1; d < runs; ){
                    days.push(buildADay(new Date(workDate.setHours(0,0,0,0)), true));
                    workDate.setDate(workDate.getDate() - 1);

                    // if weekday is 1 push 7 days:
                    d++;
                }
                days.reverse();
                /**
                 * get days
                 */

                while (date.getMonth() === month) {
                    days.push(buildADay(new Date(date), false));
                    date.setDate(date.getDate() + 1);
                }

                /**
                 * get end - offset
                 */
                var a = days.length;
                if (a % 7 !== 0) {
                    a = 7-(a % 7);
                } else {
                    a = 7;
                }
               // console.log("a:" +a);
                config.endOffset = a;
                for (var i = 0; i < a; i++) {
                    days.push(buildADay(new Date(date), true));
                    date.setDate(date.getDate() + 1);
                }

                return days;
            }
            return {
                config: config,
                days: getDaysInMonth(inDate.year, inDate.month)
            };
        }
    };
});