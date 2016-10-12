import {Component, OnInit, Input} from '@angular/core';
import {Card} from "../../models/card";

@Component({
  selector: 'app-calendar-card',
  templateUrl: './calendar-card.component.html',
  styleUrls: ['./calendar-card.component.scss']
})
export class CalendarCardComponent implements OnInit {

  @Input() public card: Card;


  constructor() {
  }

  ngOnInit() {
  }

}
