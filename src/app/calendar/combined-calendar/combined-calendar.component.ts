import {Component, OnInit, Input} from "@angular/core";
import {CalendarType} from "../../redux/actions/settings-actions";
import {Card} from "../../models/card";
import {Observable, ReplaySubject} from "rxjs";
import {select} from "ng2-redux";
import {selectCardsByDate} from "../../redux/store/selects";
import * as moment from "moment";
import {CalendarService} from "../../services/calendar.service";

// import * as moment from "moment";
// import {groupBy} from 'lodash';

export class CalendarDay {
  constructor(public date: Date,
              public cards?: Card[],
              public type?: CalendarType) {
  }

}

export class CalendarDay2 {

  date: Date;
  isToday: boolean;
  isDayOff: boolean;

  constructor() {
  }

  toString(): string {
    return moment(this.date).format('YYYY-MM-DD');
  }

  getTomorrow(): Date {
    return moment(this.date).add("days", 1).toDate();
  }

  getTomorrowAsString() {
    return moment(this.date).format('YYYY-MM-DD');
  }

}
type Test = {[id: string]: Card[]};

@Component({
  selector: 'app-combined-calendar',
  templateUrl: './combined-calendar.component.html',
  styleUrls: ['./combined-calendar.component.scss']
})
export class CombinedCalendarComponent implements OnInit {

  @Input() day: CalendarDay;  // <- weg oder?

  @select(selectCardsByDate) cards$: Observable<Test>;

  cardsByDate: {[id: string]: Card};

  daysLength: number;
  days: ReplaySubject<CalendarDay>[] = [];

  // hier schon an die karten kommen?


  today: CalendarDay2 = new CalendarDay2();

  constructor(private calendarService: CalendarService) {

    calendarService.buildDaysAsync(moment(), CalendarType.Month).then(
      days => console.log(days)
    );


    Observable.combineLatest(
      calendarService.buildDaysAsync(moment(), CalendarType.Month),
      this.cards$
    ).subscribe(
      x => console.log(this.combineDaysAndCards(x[0], x[1]))
    )

    //
    //
    // this.daysLength = 28;
    // times(this.daysLength, () => {
    //   // this.days.push(Observable.of(new CalendarDay(new Date())));
    //   let obs = new ReplaySubject(1);
    //   this.days.push(obs);
    //   obs.next(new CalendarDay(new Date()));
    // });
    //
    // let test = this.days;
    // let i = 0;
    // // setInterval(()=>{
    // //   // console.log(test[i]);
    // //   test[i].next(new CalendarDay(new Date(2000,0, 15)));
    // //   i++;
    // // }, 1000);
    // /*
    //  * der gedanke ist:
    //  *
    //  * jeder Tag bekommt ein Observable rein. Dem wird ein CalendarDay reingegebn. anhanddessen kann dann gefiltert werdne.
    //  * */
    //
    // // let test = this.days;
    // //
    // // setInterval(function () {
    // //   test.push(1)
    // // }, 1000);

    this.cards$.subscribe(cards => {

      this.cardsByDate = cards;
      console.log(cards);
    })
  }

  ngOnInit() {
  }


  combineDaysAndCards(days: CalendarDay[], cards: Test) {

    console.log(days, cards);
    console.log(days.map(
      day => {
        let dateStr = moment(day.date).format('YYYY-MM-DD');
        day.cards = cards[dateStr] || [];
      }
      )
    )
  }
}


// function sortCardsByDate (cards:Card[])  {
//   return groupBy(cards,( card) => {
//     return moment(card.due).format('YYYY-MM-DD')
//   });
// }
