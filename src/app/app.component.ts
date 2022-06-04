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
  unFilterFav:any[] = [];
  modifiedNews:any[] = [];
  allNewsShow:boolean = true;
  favNewsShow:boolean = false;
  constructor(
    private newsService:NewsService
  ){

  }

  showAllNews(){

    if(localStorage.getItem(`${this.newSelected}NewsStorage`) !== null){
      this.filterNews  =  JSON.parse( localStorage.getItem(`${this.newSelected}NewsStorage`) || "[]");
      this.allNewsShow = true;
      this.favNewsShow = false;
    }
    
  }

  showFavNews(){

    this.filterFav = [];
    this.filterNews = [];
    let newsToFilterFav =  JSON.parse(localStorage.getItem(`${this.newSelected}NewsStorage`) || "[] ");

    newsToFilterFav.forEach((e:any) => {
      if(e.points){
        this.filterFav.push(e);
      }
    })
    if(this.newSelected !== 'Select your news'){

      localStorage.setItem(`${this.newSelected}FavsStorage`, JSON.stringify(this.filterFav));
      this.filterNews = JSON.parse(localStorage.getItem(`${this.newSelected}FavsStorage`) || "[]" );
      this.allNewsShow = false;
      this.favNewsShow = true;
    }

  }

  async changeNews(){

    this.filterNews = [];

    this.allNews  = await this.newsService.consultingNews(this.newSelected).toPromise();

    this.allNews.hits.forEach((e:any, i:number) => {
      
      if(e.author !== null && e.story_title !== null && e.story_url !== null && e.created_at !== null){
        
        this.filterNews.push(e);

      }
      
    });
    if(localStorage.getItem(`${this.newSelected}NewsStorage`) === null && this.newSelected !== 'Select your news'){

      localStorage.setItem(`${this.newSelected}NewsStorage`, JSON.stringify(this.filterNews));

    }
    
    if(this.allNewsShow === true && this.favNewsShow === false){

      this.filterNews  =  JSON.parse( localStorage.getItem(`${this.newSelected}NewsStorage`) || "[]");
      
    }
    else{
      this.filterNews = JSON.parse(localStorage.getItem(`${this.newSelected}FavsStorage`) || "[]" );
      
    }

  }


  addFavorite(value:Object, i:number, e:Event){

      e.preventDefault();

      this.modifiedNews = [];

      let newsToModify =  JSON.parse(localStorage.getItem(`${this.newSelected}NewsStorage`) || "[] ");

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

    removeFavorite(value:any, i:number, e:Event){

      e.preventDefault();

      this.unFilterFav = [];

      let newsToModify =  JSON.parse(localStorage.getItem(`${this.newSelected}NewsStorage`) || "[] ");

      newsToModify.forEach((e:any) => {

        if(e.objectID === value.objectID){
          if(e.points === null){
            e.points = true; 
          }
          else{
            e.points = null;
          }
        }

        this.unFilterFav.push(e);

      })

      localStorage.setItem(`${this.newSelected}NewsStorage`, JSON.stringify(this.unFilterFav));

      this.filterNews  =  JSON.parse( localStorage.getItem(`${this.newSelected}NewsStorage`) || "[]");

      if(this.allNewsShow === false && this.favNewsShow === true){
        this.showFavNews()
      }
      
    }
    
}
