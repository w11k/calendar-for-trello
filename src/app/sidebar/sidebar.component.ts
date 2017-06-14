import {Component, OnInit, Input} from '@angular/core';
import {select} from 'ng2-redux';
import {Observable, Subscription} from 'rxjs';
import {User} from '../models/user';
import {MenuItem} from '../models/menu-item';
import {MdSidenav} from '@angular/material';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input('start') start: MdSidenav;

  @select('user') public user$: Observable<User>;
  public user: User;
  private subscriptions: Subscription[] = [];
  private activeSearch: boolean;


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
