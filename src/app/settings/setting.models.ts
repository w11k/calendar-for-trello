import {WeekStart} from '../redux/actions/settings-actions';

export class Language {
  constructor(public key: string, public name: string) {
  }
}

export class WeekStartWithTranslation {
  constructor(public key: WeekStart, public name: string) {
  }
}
