import {Component, OnInit} from '@angular/core';
import * as moment from "moment";
import {select} from "ng2-redux";
import {Observable} from "rxjs";
import * as _ from "lodash"
import {selectSettingsLanguage} from "../../redux/store/selects";

@Component({
  selector: 'app-calendar-toolbar',
  templateUrl: './calendar-toolbar.component.html',
  styleUrls: ['./calendar-toolbar.component.scss']
})
export class CalendarToolbarComponent implements OnInit {

  public headers: string[] = [];
  @select(selectSettingsLanguage) public language$: Observable<string>;

  constructor() {
    this.headers = this.build();
  }

  ngOnInit() {
    this.language$.subscribe(
      lang => this.headers = this.build()
    )
  }

  build(): string[] {
    let date = moment().startOf('week');
    let arr = [];
    _.times(7, ()=> {
      arr.push(date.format('dddd'));
      date.add(1, "days")
    });
    return arr;
  }

}
