import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DaysInThisMonth } from '../../components/calendar/calendarModels';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(public navCtrl: NavController) { }

    pressDay(pressDay: DaysInThisMonth){
        console.log(pressDay);
    }

}
