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
  filterFav:any[] = [];
  modifiedNews:any[] = [];
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
    if(localStorage.getItem(`${this.newSelected}NewsStorage`) === null){

      localStorage.setItem(`${this.newSelected}NewsStorage`, JSON.stringify(this.filterNews));

    }
    this.filterNews  =  JSON.parse( localStorage.getItem(`${this.newSelected}NewsStorage`) || "[]")  ;
    

  }


  addFavorite(value:Object, i:number){

    if(localStorage.getItem(`favStorage`) === null){

      localStorage.setItem(`favStorage`, JSON.stringify([]));

    }

    if(localStorage.getItem(`favStorage`) !== null){

      this.modifiedNews = [];

      let newsToModify =  JSON.parse(localStorage.getItem(`${this.newSelected}NewsStorage`) || "[] ")

      newsToModify.forEach( (e:any, index:number) => {
        if(index === i){
          if(e.points === null){
            e.points = true; 
          }
          else{
            e.points = null;
          }
          
        }

        this.modifiedNews.push(e)
      })

      localStorage.setItem(`${this.newSelected}NewsStorage`, JSON.stringify(this.modifiedNews));

      this.filterNews  =  JSON.parse( localStorage.getItem(`${this.newSelected}NewsStorage`) || "[]");
      
    }

  }



}
