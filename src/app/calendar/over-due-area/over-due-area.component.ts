import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Card} from '../../models/card';
import {select} from '@angular-redux/store';
import {selectOverdueCards} from '../../redux/store/selects';

@Component({
  selector: 'app-over-due-area',
  templateUrl: './over-due-area.component.html',
  styleUrls: ['./over-due-area.component.scss']
})
export class OverDueAreaComponent implements OnInit, OnDestroy {

  @select(selectOverdueCards) overdueCards$: Observable<Card[]>;
  public show = false;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
