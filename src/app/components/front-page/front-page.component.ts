import {Component, OnInit} from '@angular/core';
import {TrelloAuthService} from "../../services/trello-auth.service";

@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.scss']
})
export class FrontPageComponent implements OnInit {

  constructor(public trelloAuthService: TrelloAuthService) {
  }

  ngOnInit() {
  }

  login() {
    this.trelloAuthService.login();
  }
}
