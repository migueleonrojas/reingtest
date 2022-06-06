import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateRest'
})
export class DatePipe implements PipeTransform {
    transform(value: any): any {

        let dataActual = new Date();

        let diferentDate = (dataActual.getTime() - new Date(value).getTime())/1000;

        let year = Number(Math.trunc(diferentDate/60/60/24/30/12)); 

        let month = Number(Math.trunc(diferentDate/60/60/24/30)) - (year * 12);

        let day  = Number(Math.trunc(diferentDate/60/60/24)) - ( (year * 12 * 30) + (month * 30) );

        let hour =  Number( (Math.trunc(diferentDate/60/60)) - ( (year * 12 * 30 * 24) + (month * 30 * 24) + (day * 24) ) );

        return `${year} years ${month} months ${day} days ${hour} hours ago`;
    }
}