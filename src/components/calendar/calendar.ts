import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DaysInThisMonth } from './calendarModels';

@Component({
    selector: 'calendar',
    templateUrl: 'calendar.html'
})
export class CalendarComponent {

    calendarTitle: string = '';
    currentDay: number = 0;
    date: Date = new Date();
    daysInThisMonth: DaysInThisMonth[] = [];
    daysInLastMonth: number[] = [];
    daysInNextMonth: number[] = [];
    daysShort: {
        en: string[],
        es: string[],
    } = {
            en: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
            es: ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom']
        };
    idioms: string[] = ['en', 'es'];
    language: string = 'es';
    @Input('language')
    set _language(language: string) {
        this.language = (language != '' && this.idioms.indexOf(language) != -1) ? language : 'es';
        this.getDaysOfMonth();
    }
    get _language(): string { return this.language }
    months: {
        en: string[],
        es: string[]
    } = {
            en: ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"],
            es: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
        };
    selectedDay: number = 0;
    selectedDayEnabled: boolean = false;
    @Input('selectedDayEnabled') set _selectedDayEnabled(selectedDayEnabled: boolean) {
        this.selectedDayEnabled = selectedDayEnabled;
    };

    @Output('pressDay') _pressDay: EventEmitter<DaysInThisMonth> = new EventEmitter();

    constructor() { }

    getDaysOfMonth(day?: number) {
        this.calendarTitle = `${this.months[this.language][this.date.getMonth()]} ${this.date.getFullYear()}`;
        this.daysInLastMonth = [];
        this.daysInThisMonth = [];
        this.daysInNextMonth = [];

        if (this.date.getMonth() === new Date().getMonth()) {
            this.selectedDay = (day) ? day : new Date().getDate();
            this.currentDay = new Date().getDate();
        } else {
            this.selectedDay = (day) ? day : 1;
        }

        let firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
        if (this.language == 'es')
            firstDayThisMonth--;

        let prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();
        for (let i = prevNumOfDays - (firstDayThisMonth - 1); i <= prevNumOfDays; i++) {
            this.daysInLastMonth.push(i);
        }

        var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();
        for (var i = 0; i < thisNumOfDays; i++) {
            let dayDisplay: DaysInThisMonth = {
                currentDay: (i + 1 == this.currentDay && this.date.getMonth() == new Date().getMonth()),
                date: new Date(this.date.getFullYear(), this.date.getMonth() + 1, i + 1),
                day: i + 1,
                eventos: false,
                selected: (this.selectedDay === i + 1 || (i + 1 == this.currentDay && this.date.getMonth() == new Date().getMonth())),
                typeEvents: null
            }

            this.daysInThisMonth.push(dayDisplay);
            if (dayDisplay.selected)
                this.pressDay(dayDisplay);
        }

        var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDay();
        for (var i = 0; i < (6 - lastDayThisMonth); i++) {
            this.daysInNextMonth.push(i + 1);
        }
        var totalDays = this.daysInLastMonth.length + this.daysInThisMonth.length + this.daysInNextMonth.length;

        if (totalDays < 36) {
            for (var i = (7 - lastDayThisMonth); i < ((7 - lastDayThisMonth) + 7); i++) {
                this.daysInNextMonth.push(i);
            }
        }
        if (this.language == 'es')
            this.daysInNextMonth.push(this.daysInNextMonth.length + 1);
    }

    goToLastMonth(day?: number) {
        this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
        day = (day) ? day : 1;
        this.getDaysOfMonth(day);
    }

    goToNextMonth(day?: number) {
        this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0);
        day = (day) ? day : 1;
        this.getDaysOfMonth(day);
    }

    pressDay(day: DaysInThisMonth) {
        if (this.selectedDayEnabled) {
            this.daysInThisMonth.forEach(dayMonth => {
                dayMonth.selected = (day.day === dayMonth.day);
            });
            this.selectedDay = day.day;
            this._pressDay.emit(day);
        }
    }

}
