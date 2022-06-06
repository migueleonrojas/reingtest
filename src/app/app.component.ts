import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { NewsService } from 'src/services/select-news.services'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'testReign';
  pageScroll: number = 1;
  pageFinish!:number;
  pageUltState:number = 1;
  pageUltStateA:number = 1;
  pageUltStateR:number = 1;
  pageUltStateV:number = 1;
  indexInsert: number = 0;
  newSelected:string = 'Select your news';
  allNews!:any;
  filterNews:any[] = [];
  filterFav:any[] = [];
  unFilterFav:any[] = [];
  modifiedNews:any[] = [];
  allNewsShow:boolean = true;
  favNewsShow:boolean = false;
  showButton:boolean = false;
  private scrollHeight = 300;
  constructor(
    private newsService:NewsService,
    @Inject(DOCUMENT) private document:Document
  ){
    
  }

  @HostListener('window:scroll')
  infinityScroll(){
    const yOffSet   = window.pageYOffset;
    const scrollTop = this.document.documentElement.scrollTop;

    this.showButton = (yOffSet || scrollTop) > this.scrollHeight;
  }

  onScrollTop():void{
    this.document.documentElement.scrollTop = 0;
  }

  async onScrollDown():Promise<any>{

    if(this.pageScroll >= this.allNews.nbPages){return false}

    if(this.allNewsShow === true){

      this.pageScroll =
      ((JSON.parse( localStorage.getItem(`${this.newSelected}NewsStorage`) || "[]")).length  === 0)
        ?this.pageUltState = 1
        :(this.newSelected === 'angular')
          ? this.pageUltStateA = this.pageUltState
          :(this.newSelected === 'reactjs')
            ? this.pageUltStateR = this.pageUltState
            : (this.newSelected === 'vuejs')
              ? this.pageUltStateV = this.pageUltState
              : 1

      localStorage.setItem(`${this.newSelected}lastPage`, `${this.pageScroll}`);  

      this.allNews  = await this.newsService.consultingNews(this.newSelected, this.pageScroll).toPromise();
      
      this.pageUltState = this.allNews.page;

      this.pageUltState++;
      

      console.clear();

      console.log(this.allNews);

      console.log(`elementos de ${this.newSelected}NewsStorage: ${(JSON.parse( localStorage.getItem(`${this.newSelected}NewsStorage`) || "[]")).length}`);

      console.log(`pagina consultada de ${this.newSelected}NewsStorage: ${this.allNews.page}`);
      
      console.log(`ultima pagina consultada de ${this.newSelected}NewsStorage: ${this.pageScroll}`);

      console.log(`Ultima pagina desde local storage ${this.newSelected}NewsStorage: ${localStorage.getItem(`${this.newSelected}lastPage`)}`);

      await this.allNews.hits.forEach((e:any, i:number) => {
      
      if(e.author !== null && e.story_title !== null && e.story_url !== null && e.created_at !== null){
        
        this.filterNews.push(e);
        
      }
      
    });

    console.log(`${this.allNews.hitsPerPage}`);

    localStorage.setItem(`${this.newSelected}NewsStorage`, JSON.stringify(this.filterNews));

    if(this.allNewsShow === true && this.favNewsShow === false){

      this.filterNews  =  JSON.parse( localStorage.getItem(`${this.newSelected}NewsStorage`) || "[]");
      
    }
    else{
      this.filterNews = JSON.parse(localStorage.getItem(`${this.newSelected}FavsStorage`) || "[]" );
      
    }

    }
    

  }

  showAllNews(){

    if(localStorage.getItem(`${this.newSelected}NewsStorage`) !== null){
      this.filterNews  =  JSON.parse( localStorage.getItem(`${this.newSelected}NewsStorage`) || "[]");
      this.allNewsShow = true;
      this.favNewsShow = false;
    }
    
  }

  async showFavNews(){

    this.filterFav = [];
    this.filterNews = [];
    let newsToFilterFav =  JSON.parse(localStorage.getItem(`${this.newSelected}NewsStorage`) || "[] ");

    
    if(this.newSelected !== 'Select your news'){
      console.log(newsToFilterFav.filter((e:any) => e.points === true));
      this.filterNews = newsToFilterFav.filter((e:any) => e.points === true);
      this.allNewsShow = false;
      this.favNewsShow = true;
    }
    /* await newsToFilterFav.forEach((e:any) => {
      if(e.points){
        this.filterFav.push(e);
      }
    })
    if(this.newSelected !== 'Select your news'){

      localStorage.setItem(`${this.newSelected}FavsStorage`, JSON.stringify(this.filterFav));
      this.filterNews = JSON.parse(localStorage.getItem(`${this.newSelected}FavsStorage`) || "[]" );
      this.allNewsShow = false;
      this.favNewsShow = true;
    } */

  }

  async changeNews(){

    
    this.pageScroll =
    ((JSON.parse( localStorage.getItem(`${this.newSelected}NewsStorage`) || "[]")).length  === 0)
      ?this.pageUltState = 1
      :(this.newSelected === 'angular')
        ? this.pageUltState = this.pageUltStateA
        :(this.newSelected === 'reactjs')
          ? this.pageUltState = this.pageUltStateR
          : (this.newSelected === 'vuejs')
            ? this.pageUltState = this.pageUltStateV
            : 1

    this.pageScroll = (localStorage.getItem(`${this.newSelected}lastPage`) !== null)
      ? Number(localStorage.getItem(`${this.newSelected}lastPage`))
      : 1;
      
    this.filterNews = [];

    this.allNews  = await this.newsService.consultingNews(this.newSelected, this.pageScroll).toPromise();

    this.pageUltState = this.allNews.page;

    this.pageUltState++;

    console.clear();

    console.log(this.allNews);

    console.log(`elementos de ${this.newSelected}NewsStorage: ${(JSON.parse( localStorage.getItem(`${this.newSelected}NewsStorage`) || "[]")).length}`);

    console.log(`pagina consultada de ${this.newSelected}NewsStorage: ${this.allNews.page}`);

    console.log(`Ultima pagina desde local storage ${this.newSelected}NewsStorage: ${localStorage.getItem(`${this.newSelected}lastPage`)}`);

    

    await this.allNews.hits.forEach((e:any, i:number) => {

      
      if(e.author !== null && e.story_title !== null && e.story_url !== null && e.created_at !== null){
        
        this.filterNews.push(e);
        
      }
      
    });
    if(localStorage.getItem(`${this.newSelected}NewsStorage`) === null && this.newSelected !== 'Select your news'){

      localStorage.setItem(`${this.newSelected}lastPage`, `${this.pageScroll}`);
      localStorage.setItem(`${this.newSelected}NewsStorage`, JSON.stringify(this.filterNews));
      
    }
    
    if(this.allNewsShow === true && this.favNewsShow === false){

      this.filterNews  =  JSON.parse( localStorage.getItem(`${this.newSelected}NewsStorage`) || "[]");
      
    }
    else{
      this.filterNews = JSON.parse(localStorage.getItem(`${this.newSelected}FavsStorage`) || "[]" );
      
    }

  }


  async addFavorite(value:any, i:number, ev:Event){

      ev.preventDefault();

      this.modifiedNews = [];

      let newsToModify =  JSON.parse(localStorage.getItem(`${this.newSelected}NewsStorage`) || "[] ");

      await newsToModify.forEach( (e:any, index:number) => {
        
        console.log(value.indexFront);
        
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

      if(this.allNewsShow === true && this.favNewsShow === false){
        localStorage.setItem(`${this.newSelected}NewsStorage`, JSON.stringify(this.modifiedNews));

        this.filterNews  =  JSON.parse( localStorage.getItem(`${this.newSelected}NewsStorage`) || "[]");
      }
      else{
        localStorage.setItem(`${this.newSelected}NewsStorage`, JSON.stringify(this.modifiedNews));

        this.filterNews  =  JSON.parse( localStorage.getItem(`${this.newSelected}NewsStorage`) || "[]");

        this.showFavNews();
      }
      
      
    }

    async removeFavorite(value:any, i:number, e:Event){

      e.preventDefault();

      this.unFilterFav = [];

      let newsToModify =  JSON.parse(localStorage.getItem(`${this.newSelected}NewsStorage`) || "[] ");

      await newsToModify.forEach((e:any) => {

        if(e.created_at_i === value.created_at_i){
          
          if(e.points === null){
            e.points = true; 
          }
          else{
            e.points = null;
          }
        }

        this.unFilterFav.push(e);

      })

      localStorage.setItem(`${this.newSelected}FavsStorage`, JSON.stringify(this.unFilterFav));

      this.filterNews  =  JSON.parse( localStorage.getItem(`${this.newSelected}NewsStorage`) || "[]");

      if(this.allNewsShow === false && this.favNewsShow === true){
        
        this.showFavNews();
        
      }
      
    }
    
}
