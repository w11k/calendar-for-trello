import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {select} from '@angular-redux/store';
import {Observable} from 'rxjs';
import {User} from '../models/user';
import {MenuItem} from '../models/menu-item';
import {MatSidenav} from '@angular/material';
import {untilComponentDestroyed} from 'ng2-rx-componentdestroyed';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  @Input('start') start: MatSidenav;

  @select('user') public user$: Observable<User>;
  public user: User;
  public activeSearch: boolean;
  navigation: MenuItem[];

  constructor() {
    this.navigation = [
      new MenuItem('Calendar', '/', 'today'),
      new MenuItem('My Events', '/myEvents', 'assignment_ind', true),
      new MenuItem('Settings', '/settings', 'settings'),
      new MenuItem('About', '/about', 'info'),
    ];
  }

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
