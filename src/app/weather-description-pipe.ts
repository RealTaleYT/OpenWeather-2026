import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weatherDesc'
})
export class WeatherDescriptionPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    const map: { [key: string]: string } = {
      'muy nuboso': 'Mayormente nublado'
    };

    const key = value.toLowerCase();

    return map[key] || value;
  }
}
