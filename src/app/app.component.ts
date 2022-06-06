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
        ?this.pageUltState = 0
        :(this.newSelected === 'angular')
          ? this.pageUltStateA = this.pageUltState
          :(this.newSelected === 'reactjs')
            ? this.pageUltStateR = this.pageUltState
            : (this.newSelected === 'vuejs')
              ? this.pageUltStateV = this.pageUltState
              : 0;
      
      this.indexInsert =
      ((JSON.parse( localStorage.getItem(`${this.newSelected}lastIndex`) || "[]")).length  === 0)
        ?1
        :(JSON.parse( localStorage.getItem(`${this.newSelected}lastIndex`) || "[]"))


      localStorage.setItem(`${this.newSelected}lastPage`, `${this.pageScroll}`);  

      this.allNews  = await this.newsService.consultingNews(this.newSelected, this.pageScroll).toPromise();
      
      this.pageUltState = this.allNews.page;

      this.pageUltState++;
      

      await this.allNews.hits.forEach((e:any, i:number) => {
      
      if(e.author !== null && e.story_title !== null && e.story_url !== null && e.created_at !== null){
        
        e.indexFront = this.indexInsert;
        e.fav = false;
        this.filterNews.push(e);
        this.indexInsert++;
        
      }
      
    });


    localStorage.setItem(`${this.newSelected}NewsStorage`, JSON.stringify(this.filterNews));

    if(this.allNewsShow === true && this.favNewsShow === false){

      this.filterNews  =  JSON.parse( localStorage.getItem(`${this.newSelected}NewsStorage`) || "[]");
      localStorage.setItem(`${this.newSelected}lastIndex`, `${this.indexInsert}`);
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
      this.filterNews = newsToFilterFav.filter((e:any) => e.fav === true);
      localStorage.setItem(`${this.newSelected}FavsStorage`, JSON.stringify(this.filterNews));
      this.filterNews = JSON.parse(localStorage.getItem(`${this.newSelected}FavsStorage`) || "[] ");
      this.allNewsShow = false;
      this.favNewsShow = true;
    }

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
            : 0

    this.pageScroll = (localStorage.getItem(`${this.newSelected}lastPage`) !== null)
      ? Number(localStorage.getItem(`${this.newSelected}lastPage`))
      : 0;
    
    this.indexInsert = (localStorage.getItem(`${this.newSelected}lastIndex`) !== null)
    ? Number(localStorage.getItem(`${this.newSelected}lastIndex`))
    : 0;
      

    this.filterNews = [];

    this.allNews  = await this.newsService.consultingNews(this.newSelected, this.pageScroll).toPromise();

    this.pageUltState = this.allNews.page;

    this.pageUltState++; 

    await this.allNews.hits.forEach((e:any, i:number) => {

      
      if(e.author !== null && e.story_title !== null && e.story_url !== null && e.created_at !== null){
        e.indexFront = this.indexInsert;
        e.fav = false;
        this.filterNews.push(e);
        this.indexInsert++;
      }
      
    });
    if(localStorage.getItem(`${this.newSelected}NewsStorage`) === null && this.newSelected !== 'Select your news'){

      localStorage.setItem(`${this.newSelected}lastPage`, `${this.pageScroll}`);
      localStorage.setItem(`${this.newSelected}lastIndex`, `${this.indexInsert}`);
      localStorage.setItem(`${this.newSelected}NewsStorage`, JSON.stringify(this.filterNews));
      localStorage.setItem(`selectfilter`, `${this.newSelected}`);
      
    }
    
    if(this.allNewsShow === true && this.favNewsShow === false){

      this.filterNews  =  JSON.parse( localStorage.getItem(`${this.newSelected}NewsStorage`) || "[]");
      
    }
    else{
      this.filterNews = JSON.parse(localStorage.getItem(`${this.newSelected}FavsStorage`) || "[]" );
      this.showFavNews();
    }

  }


  async addFavorite(value:any, i:number, ev:Event){

      ev.preventDefault();

      this.modifiedNews = [];

      let newsToModify =  JSON.parse(localStorage.getItem(`${this.newSelected}NewsStorage`) || "[] ");

      await newsToModify.forEach( (e:any, index:number) => {
        
        
        if(value.indexFront === index){
          
          if(e.fav){
            e.fav = false; 
          }
          else{
            e.fav = true;
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
    
}
