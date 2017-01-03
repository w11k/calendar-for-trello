import {Component, OnInit} from '@angular/core';
import {TrelloAuthService} from "../../services/trello-auth.service";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  constructor(public trelloAuthService: TrelloAuthService) {
  }

  ngOnInit() {
  }

  login() {
    this.trelloAuthService.login();
  }

}
