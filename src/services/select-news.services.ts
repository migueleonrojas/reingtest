import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
//clase que contiene el servicio de consulta del api
//class that contains the api query service
export class NewsService {

  constructor(private httpClient: HttpClient) { }

  //consulta por query y page
  //query by query and page
  consultingNews(news:string, page:Number){
    
    return this.httpClient.get(`https://hn.algolia.com/api/v1/search_by_date?query=${news}&page=${page}`);
    
  }

  
  

  
}