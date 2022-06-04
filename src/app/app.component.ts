import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'testReign';
  newSelected:string = 'Select your news';

  changeNews(){

    console.log(this.newSelected);

  }



}
