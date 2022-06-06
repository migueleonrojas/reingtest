import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {NgxPaginationModule} from 'ngx-pagination';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { DatePipe } from 'src/pipes/date.pipe'
@NgModule({
  declarations: [
    AppComponent,
    DatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,
    InfiniteScrollModule,
    SweetAlert2Module,
    SweetAlert2Module.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
