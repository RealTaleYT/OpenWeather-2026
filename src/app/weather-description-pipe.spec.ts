import { WeatherDescriptionPipe } from './weather-description-pipe';

describe('WeatherDescriptionPipe', () => {
  it('create an instance', () => {
    const pipe = new WeatherDescriptionPipe();
    expect(pipe).toBeTruthy();
  });
});
