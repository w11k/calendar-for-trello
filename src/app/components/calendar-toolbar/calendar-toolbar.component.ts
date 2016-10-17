import {Component, OnInit} from '@angular/core';
import * as moment from "moment";
import {Moment} from "moment";

@Component({
  selector: 'app-calendar-toolbar',
  templateUrl: './calendar-toolbar.component.html',
  styleUrls: ['./calendar-toolbar.component.scss']
})
export class CalendarToolbarComponent implements OnInit {

  public headers: string[] = [];

  constructor() {
    let date = moment().startOf('week');
    _.times(7, ()=> {
      this.headers.push(date.format('dddd'));
      date.add(1, "days")
    });
  }

  ngOnInit() {
  }

}
