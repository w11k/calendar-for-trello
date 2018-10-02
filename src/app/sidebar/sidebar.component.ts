import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {select} from '@angular-redux/store';
import {Observable} from 'rxjs';
import {User} from '../models/user';
import {MatSidenav} from '@angular/material';
import {untilComponentDestroyed} from 'ng2-rx-componentdestroyed';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  @Input('start') start: MatSidenav; // tslint:disable-line:no-input-rename

  @select('user') public user$: Observable<User>;
  public user: User;
  public activeSearch: boolean;

  constructor() {}

  ngOnInit() {
    this.user$
      .pipe(untilComponentDestroyed(this))
      .subscribe(
      user => this.user = user
      );
  }

  ngOnDestroy() {
  }

}
