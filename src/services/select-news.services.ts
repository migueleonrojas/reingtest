import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
//clase que contienen los servicios que realizan los cruds al esquema del admin
export class NewsService {

  constructor(private httpClient: HttpClient) { }

  //consulta el admin usando nombre y password
  consultingNews(news:string){
    
    return this.httpClient.get(`https://hn.algolia.com/api/v1/search_by_date?query=${news}&page=0`);
    
  }

  
  

  
}