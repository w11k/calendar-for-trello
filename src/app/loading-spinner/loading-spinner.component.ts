import {Component, OnInit} from '@angular/core';
import {TrelloPullService} from '../services/trello-pull.service';
import {Observable, ReplaySubject, Subject, Subscription} from 'rxjs';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
})
export class LoadingSpinnerComponent implements OnInit {

  loadingState$: Subject<boolean> = new ReplaySubject();
  private subscriptions: Subscription[] = [];

  constructor(private trelloPullService: TrelloPullService) {
    this.loadingState$ = trelloPullService.loadingState$;
  }

  ngOnInit() {
    this.subscriptions.push(
      Observable
        .timer(0, 30000)
        .subscribe(() => {
          this.doRefresh();
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }


  doRefresh() {
    this.trelloPullService.pull();
  }
}
