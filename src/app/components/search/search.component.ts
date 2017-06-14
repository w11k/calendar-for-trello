import {Component, OnInit, ViewChild, ElementRef, Renderer} from '@angular/core';
import {Subject, Observable, Subscription} from 'rxjs';
import {select} from 'ng2-redux';
import {Card} from '../../models/card';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  term$: Subject<string> = new Subject<string>();
  public results: Card[] = [];
  private subscriptions: Subscription[] = [];

  @select('cards') public cards$: Observable<Card[]>;

  @ViewChild('input') inputEl: ElementRef;

  constructor(private renderer: Renderer) {
    this.subscriptions.push(
      Observable.combineLatest(
        this.term$,
        this.cards$
      ).subscribe(
        x => {
          const term: string = x[0];
          const cards: Card[] = x[1];
          if (term.length > 0) {
            this.results = cards.filter(
              card => card.name.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) === -1 ? false : true
            );
          }
          else {
            this.results = [];
          }
        }
      ));
  }

  ngOnInit() {
    this.renderer.invokeElementMethod(this.inputEl.nativeElement, 'focus', []);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
