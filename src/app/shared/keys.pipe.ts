import {Pipe, PipeTransform} from '@angular/core';

// Utilizzato per feature di filtro con label

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  transform(value, args:string[]) : any {
    let keys = [];
    for (let key in value) {
      keys.push(key);
    }
    return keys;
  }
}
