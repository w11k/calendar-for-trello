import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrelloPullService} from '../services/trello-pull.service';
import {Observable, Subscription, timer} from 'rxjs';
import {LoadingSpinnerService} from './loading-spinner.service';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
})
export class LoadingSpinnerComponent implements OnInit, OnDestroy {

  loadingState$: Observable<boolean>;
  private subscriptions: Subscription[] = [];

  constructor(private trelloPullService: TrelloPullService, private loadingSpinnerService: LoadingSpinnerService) {
    this.loadingState$ = loadingSpinnerService.loading;
  }

  ngOnInit() {
    this.subscriptions.push(
      timer(0, 30000)
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
