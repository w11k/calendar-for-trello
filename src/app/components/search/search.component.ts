import {Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {combineLatest, Observable, Subject} from 'rxjs';
import {select} from '@angular-redux/store';
import {Card} from '../../models/card';
import {untilComponentDestroyed} from 'ng2-rx-componentdestroyed';
import {isPlatformBrowser} from '@angular/common';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  term$: Subject<string> = new Subject<string>();
  public results: Card[] = [];

  @select('cards') public cards$: Observable<Card[]>;

  @ViewChild('input') inputEl: ElementRef;

  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
  ) {
    combineLatest(
      this.term$.pipe(
        debounceTime(300),
        distinctUntilChanged(),
      ),
        this.cards$
    )
      .pipe(untilComponentDestroyed(this))
      .subscribe(
        x => {
          const term: string = x[0];
          const cards: Card[] = x[1];
          if (term.length > 0) {
            this.results = cards.filter(
              card => card.name.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) !== -1
            );
          } else {
            this.results = [];
          }
        });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.inputEl.nativeElement.focus();
    }
  }

  ngOnDestroy() {
  }
}
