import {Component, OnInit} from '@angular/core';
const PROJECT = require("../../../../package.json");

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss']
})
export class AboutPageComponent implements OnInit {

  version: string;
  constructor() {
    this.version = PROJECT.version;
  }

  ngOnInit() {
  }

}
