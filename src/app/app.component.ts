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
  pageScroll: number = 1;//el numero actual de la pagina consultada
  pageFinish!:number;// el limite de paginas que existe en el api
  pageUltState:number = 1;// la ultima pagina que se consulto
  pageUltStateA:number = 1;// la ultima pagina que se consulto para query = angular
  pageUltStateR:number = 1;// la ultima pagina que se consulto para query = reactjs
  pageUltStateV:number = 1;// la ultima pagina que se consulto para query = vuejs
  indexInsert: number = 0;// para insertar un index a cada objeto que se guarda en local
  newSelected:string = 'Select your news';//el valor por defecto del elemento select
  allNews!:any;//todas las noticias que se obtienen a traves de la api
  filterNews:any[] = [];// las noticias filtradas cuando un dato como = author, 
  filterFav:any[] = [];                      // story_title, story_url, created_at son nulos
  unFilterFav:any[] = [];//las noticias favoritas que se le quita el propiedad de fav
  modifiedNews:any[] = [];// las noticias que estan por asignarle la propiedad de favorito
  allNewsShow:boolean = true;//mostrando las todas las noticias
  favNewsShow:boolean = false;//mostrando las noticias favoritas por categorias
  showButton:boolean = false;//para mostrar el boton que te lleva hacia arriba
  private scrollHeight = 300;// indica a cuantos pixeles se va a mostrar el boton de ir hacia arriba
  constructor(
    private newsService:NewsService,//servicio para hacer la peticion al api
    @Inject(DOCUMENT) private document:Document//para obtener el objeto DOCUMENT
  ){
    
  }

  @HostListener('window:scroll')//evento de hacer scroll
  infinityScroll(){//para indicar cuando se debe mostrar el boton para subir al principio
    const yOffSet   = window.pageYOffset;//obtiene la distancia desde el marco interno superior del cuerpo
    const scrollTop = this.document.documentElement.scrollTop;//obtiene la distancia que hay desde la parte superior de la barra de desplazamiento  hasta arriba

    this.showButton = (yOffSet || scrollTop) > this.scrollHeight;//si un valor u otro son mayores a la variable definida entonces el valor es true, para que se muestre el boton de desplazamiento hacia arriba
  }

  onScrollTop():void{//para movernos hacia arriba de la ventana
    this.document.documentElement.scrollTop = 0;
  }

  async onScrollDown():Promise<any>{//cuando se baja con el scroll

    if(this.pageScroll >= this.allNews.nbPages){return false}//si la pagina que se esta consultando es mayor o igual al limite de paginas entonces que salga de la funcion

    //si estas mostrando todas las noticias
    if(this.allNewsShow === true){

      //se obtiene la ultima pagina dependiendo del valor del select y la ultima pagina consultada en el api
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
      
      //se obtiene el ultimo indexe anexado a los objetos de consulta de noticias el cual se encuentra en local guardado
      this.indexInsert =
      ((JSON.parse( localStorage.getItem(`${this.newSelected}lastIndex`) || "[]")).length  === 0)
        ?1
        :(JSON.parse( localStorage.getItem(`${this.newSelected}lastIndex`) || "[]"))

      //se guarda en local la ultima pagina consultada en el api
      localStorage.setItem(`${this.newSelected}lastPage`, `${this.pageScroll}`);  

      //se hace la peticion al api y se guarda en una varible
      this.allNews  = await this.newsService.consultingNews(this.newSelected, this.pageScroll).toPromise();
      
      //se guarda la ultima pagina consultada
      this.pageUltState = this.allNews.page;

      //se suma 1 para que en la proxima consulta se consulte la proxima pagina
      this.pageUltState++;
      
      //se recorre todos los resultados de la consulta
      await this.allNews.hits.forEach((e:any, i:number) => {
      
      //solo se van a agregar cuando alguno de estos datos no sean nulos
      if(e.author !== null && e.story_title !== null && e.story_url !== null && e.created_at !== null){
        
        e.indexFront = this.indexInsert;//se establece un indece unico por registro a agregar
        e.fav = false;//se establece una propiedad para indicar que el registro no esta en favoritos
        this.filterNews.push(e);//se agrega en un array de datos filtrados
        this.indexInsert++;//se suma ya que deben ser indexes autoincrementable
        
      }
      
    });


    localStorage.setItem(`${this.newSelected}NewsStorage`, JSON.stringify(this.filterNews));//se guarda en local los valores filtrados

    //si estamos en la opcion marcada de "All"
    if(this.allNewsShow === true && this.favNewsShow === false){

      this.filterNews  =  JSON.parse( localStorage.getItem(`${this.newSelected}NewsStorage`) || "[]");//se muestran en la vista los datos filtrados y que estan guardados en localstorage
      localStorage.setItem(`${this.newSelected}lastIndex`, `${this.indexInsert}`);//se guarda el ultimo indice de los datos mostrados
    }
    else{
      //si estamos en la opcion marcada de "My faves" se muestran solo los favoritos por valor seleccionado
      this.filterNews = JSON.parse(localStorage.getItem(`${this.newSelected}FavsStorage`) || "[]" );
      
    }

    }
  
  }

  //metodo para mostrar todas las noticias
  showAllNews(){

    if(localStorage.getItem(`${this.newSelected}NewsStorage`) !== null){//si esta guardado en local las noticias
      this.filterNews  =  JSON.parse( localStorage.getItem(`${this.newSelected}NewsStorage`) || "[]");//se muestran las noticias que estan guardadas en local
      this.allNewsShow = true;//se indica entonces que estamos viendo las noticias porque esta seleccionado la opcion "All"
      this.favNewsShow = false;//se indica que no estamos viendo las noticias porque no estamos en la opcion "My faves"
    }
    
  }

  async showFavNews(){

    this.filterFav = [];
    
    this.filterNews = [];//se inicializa un array vacio
    let newsToFilterFav =  JSON.parse(localStorage.getItem(`${this.newSelected}NewsStorage`) || "[] ");//se obtiene los valores que estan guardados en local storage

    
    if(this.newSelected !== 'Select your news'){//se valida que no estemos seleccionando un valor del select no valido
      this.filterNews = newsToFilterFav.filter((e:any) => e.fav === true);//se muestran los valores que solo tienen el valor de fav en true
      localStorage.setItem(`${this.newSelected}FavsStorage`, JSON.stringify(this.filterNews)); //se guardan en local los favoritos dependiendo del valor del elemento select seleccionado
      this.filterNews = JSON.parse(localStorage.getItem(`${this.newSelected}FavsStorage`) || "[] ");// y nuevamente se muestra en la vista los datos favoritos que vienen guardados del local
      this.allNewsShow = false;//se indica entonces que no estamos viendo las noticias porque no esta seleccionado la opcion "All"
      this.favNewsShow = true;//se indica que estamos viendo las noticias favoritas porque estamos en la opcion "My faves"
    }

  }

  async changeNews(){
    
    //obteniendo la ultima pagina consultada en el api dependiendo del valor del elemento select seleccionado
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

    //obteniendo la pagina actual que se consultaba que esta guardado en local
    this.pageScroll = (localStorage.getItem(`${this.newSelected}lastPage`) !== null)
      ? Number(localStorage.getItem(`${this.newSelected}lastPage`))
      : 0;
    
    //obteniendo el ultimo index establecido para seguir estableciendo pero a partir del ultimo
    this.indexInsert = (localStorage.getItem(`${this.newSelected}lastIndex`) !== null)
    ? Number(localStorage.getItem(`${this.newSelected}lastIndex`))
    : 0;
      

    this.filterNews = [];//inicializando una variable como array sin elementos

    //se guarda los resultados de la petincion
    this.allNews  = await this.newsService.consultingNews(this.newSelected, this.pageScroll).toPromise();
    
    //se guarda la ultima pagina consultada
    this.pageUltState = this.allNews.page;

    //se suma 1 para que en la proxima consulta se consulte la proxima pagina
    this.pageUltState++; 


    await this.allNews.hits.forEach((e:any, i:number) => {

      //solo se van a agregar cuando alguno de estos datos no sean nulos
      if(e.author !== null && e.story_title !== null && e.story_url !== null && e.created_at !== null){
        e.indexFront = this.indexInsert;//se establece un indece unico por registro a agregar
        e.fav = false;//se establece una propiedad para indicar que el registro no esta en favoritos
        this.filterNews.push(e);//se agrega en un array de datos filtrados
        this.indexInsert++;//se suma ya que deben ser indexes autoincrementable
      }
      
    });
    //si no existe datos en local storage y si no estamos con la opcion seleccionda de = 'Select your news'
    if(localStorage.getItem(`${this.newSelected}NewsStorage`) === null && this.newSelected !== 'Select your news'){
      //se guardan los datos en local
      localStorage.setItem(`${this.newSelected}lastPage`, `${this.pageScroll}`);//se guarda la ultima pagina consultada del api
      localStorage.setItem(`${this.newSelected}lastIndex`, `${this.indexInsert}`);//se guarda el ultimo indexes que se establecio en los datos filtrados
      localStorage.setItem(`${this.newSelected}NewsStorage`, JSON.stringify(this.filterNews));//se guardans los datos filtrados en local storage
      localStorage.setItem(`selectfilter`, `${this.newSelected}`);//se guarda el valor del que esta seleccionado en el valor select
      
    }
    //si estamos en la opcion marcada de "All"
    if(this.allNewsShow === true && this.favNewsShow === false){//
      //se muestran todos los datos
      this.filterNews  =  JSON.parse( localStorage.getItem(`${this.newSelected}NewsStorage`) || "[]");
      
    }
    //si estamos en la opcion marcada de "My faves" se muestran solo los favoritos por valor seleccionado
    else{
      this.filterNews = JSON.parse(localStorage.getItem(`${this.newSelected}FavsStorage`) || "[]" );
      this.showFavNews();
    }

  }


  //para agregar favoritos
  async addFavorite(value:any, i:number, ev:Event){

      //se desactiva el comportamiento por defecto para que no actue como un hipervinculo
      ev.preventDefault();

      this.modifiedNews = [];// se inicializa un array sin elementos

      //se obtiene los valores que estan guardados en local
      let newsToModify =  JSON.parse(localStorage.getItem(`${this.newSelected}NewsStorage`) || "[] ");

      //se recorre todos los elementos que esta guardado en local
      await newsToModify.forEach( (e:any, index:number) => {
        //si el elemento que se le da click es igual al que esta guardado en local
        if(value.indexFront === index){

          //se va a modificar su propiedad para que sea favorito o deje de ser favorito
          if(e.fav){
            e.fav = false; 
          }
          else{
            e.fav = true;
          }
          
        }
        //se agrega los elementos del array modificado a otro array
        this.modifiedNews.push(e)
      })

      //si estas en la opcion "All"
      if(this.allNewsShow === true && this.favNewsShow === false){
        //se guarda el array modificado en local
        localStorage.setItem(`${this.newSelected}NewsStorage`, JSON.stringify(this.modifiedNews));
        //ahora se muestra toda esa informacion en la vista
        this.filterNews  =  JSON.parse( localStorage.getItem(`${this.newSelected}NewsStorage`) || "[]");
      }
      else{
        //se guarda el array modificado en local
        localStorage.setItem(`${this.newSelected}NewsStorage`, JSON.stringify(this.modifiedNews));

        //ahora se muestra toda esa informacion en la vista
        this.filterNews  =  JSON.parse( localStorage.getItem(`${this.newSelected}NewsStorage`) || "[]");

        //se llama la funcion para que se muestren los favoritos
        this.showFavNews();
      }
      
      
    }
    
}
