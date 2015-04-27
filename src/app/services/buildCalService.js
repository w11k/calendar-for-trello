"use strict";
angular.module("w11kcal.app").factory("buildCalService", /*ngInject*/  function (/*saveService*/) {

    /**
     * returns amount of days for month in year
     */

    var config = {
        startOffset: "",
        endOffSet:""
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
                console.log("offset start:"+ runs);
                if (runs === 1) {
                    // if week starts with monday, add 7 days
                    runs = 7;
                }
                config.startOffset = runs;
                var workDate = new Date(date-1);
                for (var d = 1; d < runs; ){
                    days.push(new Date(workDate));
                    workDate.setDate(workDate.getDate() - 1);

                    // if weekday is 1 push 7 days:
                    d++;
                }
                days.reverse();
                /**
                 * get days
                 */

                while (date.getMonth() === month) {
                    days.push(new Date(date));
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
                config.endOffSet = a;
                for (var i = 0; i < a; i++) {
                    days.push(new Date(date));
                    date.setDate(date.getDate() + 1);
                }


                console.log(days);
                return days;
            }
            return getDaysInMonth(inDate.year, inDate.month);
        }
    };
});