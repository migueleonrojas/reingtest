import { Component } from '@angular/core';
import { NewsService } from 'src/services/select-news.services'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'testReign';
  newSelected:string = 'Select your news';
  allNews!:any;
  filterNews:any[] = [];
  
  constructor(
    private newsService:NewsService
  ){

  }

  async changeNews(){
    this.filterNews = [];

    this.allNews  = await this.newsService.consultingNews(this.newSelected).toPromise();

    this.allNews.hits.forEach((e:any, i:number) => {
      
      if(e.author !== null && e.story_title !== null && e.story_url !== null && e.created_at !== null){
        this.filterNews.push(e);
      }
      
    });

    console.log(this.filterNews);
    

  }



}
