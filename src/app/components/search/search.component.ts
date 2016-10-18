import {Component, OnInit, Output} from '@angular/core';
import {Subject, Observable} from "rxjs";
import {select} from "ng2-redux";
import {Card} from "../../models/card";
import {subscribeOn} from "rxjs/operator/subscribeOn";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  // @Output public searchStr: string;
  term$: Subject<string> = new Subject<string>();
  public results: Card[] = [];

  @select("cards") public cards$: Observable<Card[]>;

  constructor() {
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
          )
        }
        else {
          this.results = [];
        }
      }
    )
  }

  ngOnInit() {
  }
}
