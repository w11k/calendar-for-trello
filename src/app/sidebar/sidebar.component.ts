import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {select} from '@angular-redux/store';
import {Observable, Subscription} from 'rxjs';
import {User} from '../models/user';
import {MenuItem} from '../models/menu-item';
import {MatSidenav} from '@angular/material';

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
  private subscriptions: Subscription[] = [];

  navigation: MenuItem[];

  constructor() {
    this.navigation = [
      new MenuItem('Calendar', '/', 'today'),
      new MenuItem('Settings', '/settings', 'settings'),
      new MenuItem('About', '/about', 'info'),
    ];
  }

  ngOnInit() {
    this.subscriptions.push(this.user$.subscribe(
      user => this.user = user
    ));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
