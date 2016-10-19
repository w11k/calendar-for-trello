import {Injectable, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {select} from "ng2-redux";

@Injectable()
export class DateTimeFormatService implements OnInit {
  @select(state => state.settings.language) public language$: Observable<string>;
  private language: string = "en";

  ngOnInit() {
    this.language$.subscribe(lang => this.language = lang);
  }


  // returns the correct momentjs format
  getTimeFormat(): string {
    let format;
    switch (this.language) {
      case "de":
        format = "HH:mm";
        break;
      case "fr":
        format = "HH:mm";
        break;
      case "en":
        format = "ha";
        break;
      default:
        format = "ha";
    }
    return format;
  }

}
