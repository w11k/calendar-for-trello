import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrelloPullService} from '../services/trello-pull.service';
import {Observable, Subscription, timer} from 'rxjs';
import {LoadingSpinnerService} from './loading-spinner.service';
import {HideLoadButton} from './../conversations/ngxs/app.action';
import {Select, Store} from '@ngxs/store';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
})
export class LoadingSpinnerComponent implements OnInit, OnDestroy {

  loadingState$: Observable<boolean>;
  private subscriptions: Subscription[] = [];

  constructor(private trelloPullService: TrelloPullService, private loadingSpinnerService: LoadingSpinnerService, private store: Store) {
    this.loadingState$ = loadingSpinnerService.loading;
  }

  ngOnInit() {
    this.subscriptions.push(
      timer(0, 30000)
        .subscribe(() => {
          this.doRefresh();
        })
    );
    this.loadingState$.subscribe(loading => this.store.dispatch(new HideLoadButton(loading)));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }


  doRefresh() {
    this.trelloPullService.pull();
  }
}
