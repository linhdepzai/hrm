import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vnd'
})
export class VndPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format(value);
  }

}
