import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, SelectChangeEventDetail, IonSelect, IonSelectOption, IonButton, IonCard, IonCardContent, IonItem, IonAccordionGroup, IonAccordion, IonLabel, IonRow, IonCol, IonGrid, IonText } from '@ionic/angular/standalone';
import { IonSelectCustomEvent } from '@ionic/core';
import { NgFor, DatePipe, TitleCasePipe } from '@angular/common';
import { WeatherDescriptionPipe } from "../weather-description-pipe";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonText, IonGrid, IonCol, IonRow, IonLabel, IonAccordion, IonAccordionGroup, IonCardContent, DatePipe, IonCard, IonHeader, IonToolbar, IonTitle, IonContent, IonSelect, IonSelectOption, NgFor, IonButton, IonItem, WeatherDescriptionPipe, TitleCasePipe],
})
export class HomePage {
  constructor() {}
  weatherMostradoCiudad: boolean = false;
  weatherMostradoLocation: boolean = false;
  todayForecast: any[] = [];
  nextDays: any[] = [];
  lang = [{name:'Spanish', value:'es'}, {name:'English', value:'en'}, {name:'French', value:'fr'}, {name:'German', value:'de'}, {name:'Italian', value:'it'}, {name:'Portuguese', value:'pt'}, {name:'Japanese', value:'jp'}, {name:'Chinese', value:'cn'}, {name:'Russian', value:'ru'}, {name:'Arabic', value:'ar'}, {name:'Hindi', value:'hi'}, {name:'Bengali', value:'bn'}, {name:'Korean', value:'ko'}, {name:'Turkish', value: 'tr'}, {name: 'Dutch', value: 'nl'}, {name: 'Swedish', value: 'sv'}, {name: 'Norwegian', value: 'no'}, {name: 'Danish', value: 'da'}, {name: 'Finnish', value: 'fi'}, {name: 'Polish', value: 'pl'}];
  cities = [
    { name: 'Madrid', country: 'ES' },
    { name: 'Pamplona', country: 'ES' },
    { name: 'London', country: 'GB' },
    { name: 'New York', country: 'US' },
    { name: 'Tokyo', country: 'JP' },
    { name: 'Paris', country: 'FR' },
    { name: 'Berlin', country: 'DE' },
    { name: 'Rome', country: 'IT' },
    { name: 'Lisboa', country: 'PT' },
    { name: 'Buenos Aires', country: 'AR' },
    { name: 'Sao Paulo', country: 'BR' },
    { name: 'Moscow', country: 'RU' },
    { name: 'Beijing', country: 'CN' },
    { name: 'Delhi', country: 'IN' },
    { name: 'Cairo', country: 'EG' }
  ];
  selectedCity: any = "";
  selectedLang: any = "es";
  onCityChange($event: IonSelectCustomEvent<SelectChangeEventDetail<any>>) {
    console.log('Ciudad seleccionada:', $event.detail.value);
    this.selectedCity = $event.detail.value;
  }
  apikey: string = "6bc0d1c22c462a751fe8bb9330e7bdf9";
  
  getWeather() {
    if (!this.selectedCity) return;

    const apiurl =
      `https://api.openweathermap.org/data/2.5/forecast?q=${this.selectedCity.name}&units=metric&lang=${this.selectedLang}&appid=${this.apikey}`;

    fetch(apiurl)
      .then(res => res.json())
      .then(data => {
        this.processForecast(data.list);
      })
      .catch(err => console.error(err));
      this.weatherMostradoCiudad = true;
      this.weatherMostradoLocation = false;
  }
  getWeatherByLocation() {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const apiurl =
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=${this.selectedLang}&appid=${this.apikey}`;

      fetch(apiurl)
        .then(res => res.json())
        .then(data => {
          this.processForecast(data.list);
        })
        .catch(err => console.error(err));
    });
    this.weatherMostradoLocation = true;
    this.weatherMostradoCiudad = false;
  }
  processForecast(list: any[]) {
    // Obtener la fecha de hoy en formato YYYY-MM-DD
    const now = new Date();
    const today = now.getFullYear() + '-' +
                  String(now.getMonth() + 1).padStart(2, '0') + '-' +
                  String(now.getDate()).padStart(2, '0');

    // HOY
    this.todayForecast = list.filter(item => {
      const datePart = item.dt_txt.split(' ')[0];
      return datePart === today;
    });

    // AGRUPAR POR DÍA
    const grouped: any = {};
    list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(item);
    });

    // 4 días siguientes
    this.nextDays = Object.keys(grouped)
      .filter(date => date !== today)
      .slice(0, 4)
      .map(date => ({
        date,
        hours: grouped[date]
      }));

    console.log('Today:', this.todayForecast);
    console.log('Next days:', this.nextDays);
  }
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);        // convierte la fecha de la API a objeto Date
    const today = new Date();              // fecha actual

    // si no es hoy ni mañana, devuelve día de la semana + dd/MM/yyyy en español
    return date.toLocaleDateString(this.selectedLang + '-'+ this.selectedLang.toUpperCase(), {
      weekday: 'long', // lunes, martes...
      day: '2-digit',  // 01, 22...
      month: '2-digit', // 01, 12...
      year: 'numeric'   // 2026
    });
  }
  changeLanguage(event: IonSelectCustomEvent<SelectChangeEventDetail<any>>) {
    console.log('Idioma seleccionado:', event.detail.value);
    this.selectedLang = event.detail.value;
    if(this.weatherMostradoCiudad){
      this.getWeather();
    }else if(this.weatherMostradoLocation){
      this.getWeatherByLocation();
    }
  }
}