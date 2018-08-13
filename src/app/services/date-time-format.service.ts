import {Injectable} from '@angular/core';

@Injectable()
export class DateTimeFormatService {

  /**
   * @deprecated: format in template instead*/
  getTimeFormat(language = 'en'): string {
    let format;
    switch (language) {
      case 'de':
        format = 'HH:mm';
        break;
      case 'fr':
        format = 'HH:mm';
        break;
      case 'en':
        format = 'hh a';
        break;
      default:
        format = 'hh a';
    }
    return format;
  }

}
