'use strict';
angular.module('trelloCal').factory('buildCalService', /*ngInject*/  function (webStorage) {

    /**
     * returns amount of days for month in year
     */

    var config = {
        startOffset: null,
        endOffSet: null
    };

    var boards = [];
    var cards = [];

    return {
        refresh: function () {
            cards = [];
            var card;
            if (webStorage.get('TrelloCalendarStorage').me.observer === true) {
                var all = (webStorage.get('TrelloCalendarStorage')).cards.all;
                for (card in all) {
                    cards.push(all[card]);
                }

            }
            else {
                var my = (webStorage.get('TrelloCalendarStorage')).cards.my;
                for (card in my) {
                    cards.push(my[card]);
                }

            }
        },

        build: function (inDate) {

            boards = [];


            cards = _.groupBy(cards, 'dueDay');

            delete cards.undefined;
            var buildADay = function (date, dayOff) {


                var isToday = (new Date(+date).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0));
                var day = {
                    date: date,
                    dayOff: dayOff,
                    cards: [],
                    isToday: isToday,
                    weekday: moment(new Date(date)).format('dddd')
                };
                if (cards[date.toUTCString()]) {

                    cards[date.toUTCString()].forEach(function (item) {
                        var board = {
                            name: item.boardName,
                            _lowername: item.boardName.toLowerCase(),
                            id: item.idBoard,
                            image: '#',
                            email: '#',
                            color: item.color

                        };

                        boards.push(board);
                        day.cards.push(item);
                    });
                }
                return day;
            };
            var days = [];

            function getDaysInMonth(year, month) {
                var date = new Date(year, month, 1);
                /**
                 * get start - offset
                 */
                var runs = moment(date).isoWeekday();

                if (runs === 1) {
                    // if week starts with monday, add 7 days
                    runs = 8;
                }
                config.startOffset = runs - 1;
                var workDate = new Date(date - 1);
                for (var d = 1; d < runs;) {
                    days.push(buildADay(new Date(workDate.setHours(0, 0, 0, 0)), true));
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
                    a = 7 - (a % 7);
                } else {
                    a = 7;
                }
                config.endOffset = a;
                for (var i = 0; i < a; i++) {
                    days.push(buildADay(new Date(date), true));
                    date.setDate(date.getDate() + 1);
                }
                return days;
            }

            return {
                config: config,
                days: getDaysInMonth(inDate.year, inDate.month),
                boards: boards
            };
        },
        boards: function () {
            return _.uniq(boards, function (item) {
                return 'id:' + item.id + 'name:' + item.name;
            });


        }

    };
});