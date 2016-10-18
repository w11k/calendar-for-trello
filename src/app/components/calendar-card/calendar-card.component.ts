import {Component, OnInit, Input} from '@angular/core';
import {Card} from "../../models/card";
import {select} from "ng2-redux";
import {Observable} from "rxjs";

@Component({
  selector: 'app-calendar-card',
  templateUrl: './calendar-card.component.html',
  styleUrls: ['./calendar-card.component.scss']
})
export class CalendarCardComponent implements OnInit {

  @Input() public card: Card;
  color: string;
  @select(state => state.settings.boardColorPrefs) public boardColorPrefs$: Observable<Object>;

  constructor() {
  }

  ngOnInit() {
    this.boardColorPrefs$.subscribe(
      prefs => this.color = prefs[this.card.idBoard]
    )
  }
}
