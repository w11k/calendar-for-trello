import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'cutString'
})
export class CutStringPipe implements PipeTransform {

  transform(value: string, cutAt: number = 10): string {
    if (value.length > cutAt) {
      return value.substr(0, cutAt) + "…"
    }
    return value;
  }

}
