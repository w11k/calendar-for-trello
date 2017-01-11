import {Component, OnInit} from '@angular/core';
import {select} from "ng2-redux";
import {Observable} from "rxjs";
import {User} from "../models/user";
import {MenuItem} from "../models/menu-item";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {


  @select("user") public user$: Observable<User>;
  public user: User;


  navigation: MenuItem[];

  constructor() {
    this.navigation = [
      new MenuItem("Calendar", "/", "today"),
      new MenuItem("Settings", "/settings", "settings"),
      new MenuItem("About", "/about", "info"),
    ];
  }

  ngOnInit() {
    this.user$.subscribe(user => this.user = user)
  }

}
