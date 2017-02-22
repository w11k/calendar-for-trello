import {Component, OnInit, Input} from '@angular/core';
import {Observable, Subject, ReplaySubject} from "rxjs";
import {CalendarDay} from "../combined-calendar/combined-calendar.component";

@Component({
  selector: 'app-combined-calendar-day',
  templateUrl: './combined-calendar-day.component.html',
  styleUrls: ['./combined-calendar-day.component.scss']
})
export class CombinedCalendarDayComponent implements OnInit {

  @Input() day: ReplaySubject<CalendarDay>;

  constructor() {
    console.log("construcotr")
  }

  ngOnInit() {
    this.day.subscribe(day => console.log(day));
  }

}
