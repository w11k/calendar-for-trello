import {Injectable} from '@angular/core';

@Injectable()
export class DateTimeFormatService {

  // returns the correct momentjs format
  getTimeFormat(language: string = "en"): string {
    let format;
    switch (language) {
      case "de":
        format = "HH:mm";
        break;
      case "fr":
        format = "HH:mm";
        break;
      case "en":
        format = "hh a";
        break;
      default:
        format = "hh a";
    }
    return format;
  }

}
