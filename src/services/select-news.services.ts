import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class NewsService {

  constructor(private httpClient: HttpClient) { }

  //consulta por query y page
  consultingNews(news:string, page:Number){
    
    return this.httpClient.get(`https://hn.algolia.com/api/v1/search_by_date?query=${news}&page=${page}`);
    
  }

  
  

  
}