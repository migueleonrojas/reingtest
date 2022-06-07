import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateRest'
})
//transforma la data que se le pase para adecuarla
//transforms the data passed to it to suit it
export class DatePipe implements PipeTransform {
    transform(value: any): any {

        let dataActual = new Date();//obtiene la data actual

        let diferentDate = (dataActual.getTime() - new Date(value).getTime())/1000;//obtiene la diferencia de fechas a segundos // get the difference of dates to seconds

        let year = Number(Math.trunc(diferentDate/60/60/24/30/12));// de segundos lo paso a años // From seconds I pass it to years

        // de segundos lo pase a meses y le resto los años pasado a meses // from seconds I pass it to months and I subtract the years passed to months
        let month = Number(Math.trunc(diferentDate/60/60/24/30)) - (year * 12);

        // de segundo lo paso a dias y le resto los años pasado a dias y los meses pasado a dias // From second I pass it to days and I subtract the years passed to days and the months passed to days
        let day  = Number(Math.trunc(diferentDate/60/60/24)) - ( (year * 12 * 30) + (month * 30) );

        // de segundo lo paso a horas y le resto los años pasado a horas, los meses pasado a horas y los dias pasado a horas // From a second I convert it to hours and subtract the years from hours, the months from hours and the days from hours
        let hour =  Number( (Math.trunc(diferentDate/60/60)) - ( (year * 12 * 30 * 24) + (month * 30 * 24) + (day * 24) ) );

        // y retorno el resultado dentro de un mensaje // and return the result inside a message
        return `${year} years ${month} months ${day} days ${hour} hours ago`;
    }
}