import {Injectable} from '@angular/core';

@Injectable()
export class DateTimeFormatService {

  /**
   * @deprecated: format in template instead*/
  getTimeFormat(language = getBrowserLang()): string {
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

/**@deprecated use with angular i18n in future*/
function getBrowserLang(): string {
  let str;

  try {
    str = navigator.language || (navigator as any).userLanguage || 'en';
  } catch (e) {
    str = 'en';
  }

  return str;

}
