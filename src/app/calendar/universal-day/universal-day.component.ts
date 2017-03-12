import {Component, OnInit, Input, HostBinding, Renderer, ElementRef} from '@angular/core';
import {Subject} from 'rxjs';
import {CalendarDay} from '../../models/calendar-day';
import {CalendarType} from '../../redux/actions/settings-actions';
import * as moment from 'moment';
import {WeekDaySlot} from '../week/WeekDaySlot';
import {Card} from '../../models/card';
import {DateTimeFormatService} from '../../services/date-time-format.service';

@Component({
  selector: 'app-universal-day',
  templateUrl: './universal-day.component.html',
  styleUrls: ['./universal-day.component.scss']
})
export class UniversalDayComponent implements OnInit {

  @Input() day: Subject<CalendarDay>;
  @Input() calendarType: Subject<CalendarType>;

  CalendarType = CalendarType;

  slot: CalendarDay;

  constructor(private renderer: Renderer,
              private element: ElementRef,
              private dateTimeFormatService: DateTimeFormatService) {
    console.log('CONSTRUCTOR');
  }

  ngOnInit() {


    console.log('ONINIT');

    this.day.subscribe(
        day => {


          if (day) {
            this.slot = day;
            this.test = 'block';

            this.createHours([day], day.cards);


            if (this.slot.isDayOff) {
              this.renderer.setElementClass(this.element.nativeElement, 'offsetDay', true);
            }

            if (this.slot.isToday) {
              this.renderer.setElementClass(this.element.nativeElement, 'today', true);
            }


          } else {
            this.slot = null;
            this.test = 'none';
          }
        }
    );
  }

  public slots: WeekDaySlot[] = [];
  public cards: Card[];

  public cardHolder: Object; //  {key: Cards[]}


  createHours = (calendarDays: CalendarDay[], cards: Card[] = []) => {
    this.cardHolder = {};
    calendarDays.map(day => {
      this.cardHolder[moment(day.date).format('MM-DD-YYYY')] = cards.filter(card => moment(card.due).isSame(day.date, 'day'))
      return day;
    });
    for (let i = 0; i < 24; i++) {
      calendarDays.forEach((calendarDay) => {
        let baseDate = moment(calendarDay.date).hours(i).minutes(0).seconds(0).milliseconds(0);
        this.slots.push(
            new WeekDaySlot(baseDate.format(this.dateTimeFormatService.getTimeFormat('de')),
                this.cardHolder[moment(calendarDay.date).format('MM-DD-YYYY')].filter(card => i === moment(card.due).hour()),
                calendarDay,
                i
            ));
      });
    }
  };


  @HostBinding('style.display') test;
}
