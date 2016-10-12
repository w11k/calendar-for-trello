import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-set-token',
  templateUrl: './set-token.component.html',
  styleUrls: ['./set-token.component.scss']
})
export class SetTokenComponent implements OnInit {

  constructor(public router: Router) {
  }

  ngOnInit() {
    let hash = window.location.hash;
    let token = hash.split('=')[1];
    localStorage.setItem("token", token);
    this.router.navigate(['/']);
  }

}
