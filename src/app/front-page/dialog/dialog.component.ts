import {Component, OnInit} from '@angular/core';
import {TrelloAuthService} from '../../services/trello-auth.service';
import {Router} from '@angular/router';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogComponent>, public trelloAuthService: TrelloAuthService, public router: Router) {
  }

  ngOnInit() {
  }

  login() {
    this.trelloAuthService.login();
  }

  toAbout() {
    this.close();
    this.router.navigate(['/about']);
  }

  close() {
    this.dialogRef.close();
  }
}
