import {Component, OnInit} from '@angular/core';
import {TrelloAuthService} from "../services/trello-auth.service";
import {MdDialog, MdDialogConfig} from '@angular/material';
import {DialogComponent} from "./dialog/dialog.component";

@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.scss']
})
export class FrontPageComponent implements OnInit {

  constructor(public dialog: MdDialog) {

    let config = new MdDialogConfig();
    config.disableClose = true;

    // disableClose
    let dialogRef = this.dialog.open(DialogComponent, config);
    // dialogRef.afterClosed().subscribe(result => {
    //   // this.selectedOption = result;
    // });

  }

  ngOnInit() {
  }

}
