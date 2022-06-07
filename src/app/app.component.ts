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
  pageScroll: number = 1;//el numero actual de la pagina consultada //the current number of the page consulted
  pageFinish!:number;// el limite de paginas que existe en el api // the limit of pages that exists in the api
  pageUltState:number = 1;// la ultima pagina que se consulto // the last page consulted
  pageUltStateA:number = 1;// la ultima pagina que se consulto para query = angular // the last page that was consulted for query = angular
  pageUltStateR:number = 1;// la ultima pagina que se consulto para query = reactjs // the last page that was consulted for query = reactjs
  pageUltStateV:number = 1;// la ultima pagina que se consulto para query = vuejs  //  the last page that was consulted for query = vuejs
  indexInsert: number = 0;// para insertar un index a cada objeto que se guarda en local  // to insert an index to each object that is saved locally 
  newSelected:string = 'Select your news';//el valor por defecto del elemento select // the default value of the select element
  allNews!:any;//todas las noticias que se obtienen a traves de la api // all the news that are obtained through the api
  filterNews:any[] = [];// las noticias filtradas cuando un dato como = author, story_title, story_url, created_at son nulos
                        // the filtered news when a fact like = author, story_title, story_url, created_at they are null
  filterFav:any[] = [];                      
  unFilterFav:any[] = [];//las noticias favoritas que se le quita el propiedad de fav // the favorite news that the property of fav is removed
  modifiedNews:any[] = [];// las noticias que estan por asignarle la propiedad de favorito // the news that are about to be assigned the property of favorite
  allNewsShow:boolean = true;//mostrando las todas las noticias // showing all the news
  favNewsShow:boolean = false;//mostrando las noticias favoritas por categorias // showing the favorite news by categories
  showButton:boolean = false;//para mostrar el boton que te lleva hacia arriba // to show the button that takes you up
  private scrollHeight = 300;// indica a cuantos pixeles se va a mostrar el boton de ir hacia arriba //  indicates how many pixels the button to go up is going to be shown
  constructor(
    private newsService:NewsService,//servicio para hacer la peticion al api // service to make the request to the api
    @Inject(DOCUMENT) private document:Document//para obtener el objeto DOCUMENT // to get the DOCUMENT object
  ){
    
  }

  @HostListener('window:scroll')//evento de hacer scroll // scroll event
  infinityScroll(){//para indicar cuando se debe mostrar el boton para subir al principio // to indicate when the button to upload should be shown at the beginning
    const yOffSet   = window.pageYOffset;//obtiene la distancia desde el marco interno superior del cuerpo // gets the distance from the upper internal frame of the body
    const scrollTop = this.document.documentElement.scrollTop;//obtiene la distancia que hay desde la parte superior de la barra de desplazamiento  hasta arriba // gets the distance from the top of the scrollbar to the top

    this.showButton = (yOffSet || scrollTop) > this.scrollHeight;//si un valor u otro son mayores a la variable definida entonces el valor es true, para que se muestre el boton de desplazamiento hacia arriba
  }                                                               // if one value or another is greater than the defined variable then the value is true, so that the scroll up button is shown

  onScrollTop():void{//para movernos hacia arriba de la ventana // to move up the window
    this.document.documentElement.scrollTop = 0;
  }

  async onScrollDown():Promise<any>{//cuando se baja con el scroll // when scrolling down

    if(this.pageScroll >= this.allNews.nbPages){return false}//si la pagina que se esta consultando es mayor o igual al limite de paginas entonces que salga de la funcion // if the page being queried is greater than or equal to the page limit then exit the function

    //si estas mostrando todas las noticias // if you are showing all the news
    if(this.allNewsShow === true){

      //se obtiene la ultima pagina dependiendo del valor del select y la ultima pagina consultada en el api
      //the last page is obtained depending on the value of the select and the last page consulted in the api
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
      //the last index attached to the news query objects is obtained, which is located in the saved location
      this.indexInsert =
      ((JSON.parse( localStorage.getItem(`${this.newSelected}lastIndex`) || "[]")).length  === 0)
        ?1
        :(JSON.parse( localStorage.getItem(`${this.newSelected}lastIndex`) || "[]"))

      //se guarda en local la ultima pagina consultada en el api // the last page consulted in the api is saved locally
      localStorage.setItem(`${this.newSelected}lastPage`, `${this.pageScroll}`);  

      //se hace la peticion al api y se guarda en una varible // the request is made to the api and it is saved in a variable
      this.allNews  = await this.newsService.consultingNews(this.newSelected, this.pageScroll).toPromise();
      
      //se guarda la ultima pagina consultada // the last page viewed is saved
      this.pageUltState = this.allNews.page;

      //se suma 1 para que en la proxima consulta se consulte la proxima pagina  // add 1 so that in the next query the next page is consulted
      this.pageUltState++;
      
      //se recorre todos los resultados de la consulta // loop through all query results
      await this.allNews.hits.forEach((e:any, i:number) => {
      
      //solo se van a agregar cuando alguno de estos datos no sean nulos // they will only be added when any of these data are not null
      if(e.author !== null && e.story_title !== null && e.story_url !== null && e.created_at !== null){
        
        e.indexFront = this.indexInsert;//se establece un indece unico por registro a agregar // a unique index is established per record to add
        e.fav = false;//se establece una propiedad para indicar que el registro no esta en favoritos // a property is set to indicate that the record is not in favorites
        this.filterNews.push(e);//se agrega en un array de datos filtrados // se agrega en un array de datos filtrados
        this.indexInsert++;//se suma ya que deben ser indexes autoincrementable // is added since indexes should be autoincrementable
        
      }
      
    });


    localStorage.setItem(`${this.newSelected}NewsStorage`, JSON.stringify(this.filterNews));//se guarda en local los valores filtrados // the filtered values ​​are saved locally

    //si estamos en la opcion marcada de "All" // if we are in the marked option of "All"
    if(this.allNewsShow === true && this.favNewsShow === false){

      this.filterNews  =  JSON.parse( localStorage.getItem(`${this.newSelected}NewsStorage`) || "[]");//se muestran en la vista los datos filtrados y que estan guardados en localstorage // the filtered data and that are saved in localstorage are shown in the view
      localStorage.setItem(`${this.newSelected}lastIndex`, `${this.indexInsert}`);//se guarda el ultimo indice de los datos mostrados // the last index of the displayed data is saved
    }
    else{
      //si estamos en la opcion marcada de "My faves" se muestran solo los favoritos por valor seleccionado // 
      //if we are in the marked option of "My faves" only the favorites by selected value are shown
      this.filterNews = JSON.parse(localStorage.getItem(`${this.newSelected}FavsStorage`) || "[]" );
      
    }

    }
  
  }

  //metodo para mostrar todas las noticias // method to display all news
  showAllNews(){

    if(localStorage.getItem(`${this.newSelected}NewsStorage`) !== null){//si esta guardado en local las noticias // if the news is saved locally
      this.filterNews  =  JSON.parse( localStorage.getItem(`${this.newSelected}NewsStorage`) || "[]");//se muestran las noticias que estan guardadas en local // the news that are saved locally are shown
      this.allNewsShow = true;//se indica entonces que estamos viendo las noticias porque esta seleccionado la opcion "All" // then it is indicated that we are watching the news because the "All" option is selected
      this.favNewsShow = false;//se indica que no estamos viendo las noticias porque no estamos en la opcion "My faves" // it is indicated that we are not seeing the news because we are not in the "My faves" option
    }
    
  }

  async showFavNews(){

    this.filterFav = [];
    
    this.filterNews = [];//se inicializa un array vacio // an empty array is initialized
    let newsToFilterFav =  JSON.parse(localStorage.getItem(`${this.newSelected}NewsStorage`) || "[] ");//se obtiene los valores que estan guardados en local storage

    
    if(this.newSelected !== 'Select your news'){//se valida que no estemos seleccionando un valor del select no valido // it is validated that we are not selecting an invalid select value
      this.filterNews = newsToFilterFav.filter((e:any) => e.fav === true);//se muestran los valores que solo tienen el valor de fav en true  //  values ​​that only have the value of fav set to true are displayed
      localStorage.setItem(`${this.newSelected}FavsStorage`, JSON.stringify(this.filterNews)); //se guardan en local los favoritos dependiendo del valor del elemento select seleccionado  //  favorites are saved locally depending on the value of the selected select element
      this.filterNews = JSON.parse(localStorage.getItem(`${this.newSelected}FavsStorage`) || "[] ");// y nuevamente se muestra en la vista los datos favoritos que vienen guardados del local // and again the favorite data that is saved from the local is shown in the view
      this.allNewsShow = false;//se indica entonces que no estamos viendo las noticias porque no esta seleccionado la opcion "All" // then it is indicated that we are not seeing the news because the "All" option is not selected
      this.favNewsShow = true;//se indica que estamos viendo las noticias favoritas porque estamos en la opcion "My faves" //  it is indicated that we are seeing the favorite news because we are in the "My faves" option
    }

  }

  async changeNews(){
    
    //obteniendo la ultima pagina consultada en el api dependiendo del valor del elemento select seleccionado  // getting the last page consulted in the api depending on the value of the selected select element
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
    //obtaining the current page that was consulted that is saved locally
    this.pageScroll = (localStorage.getItem(`${this.newSelected}lastPage`) !== null)
      ? Number(localStorage.getItem(`${this.newSelected}lastPage`))
      : 0;
    
    //obteniendo el ultimo index establecido para seguir estableciendo pero a partir del ultimo
    //getting the last index set to keep setting but starting from the last
    this.indexInsert = (localStorage.getItem(`${this.newSelected}lastIndex`) !== null)
    ? Number(localStorage.getItem(`${this.newSelected}lastIndex`))
    : 0;
      

    this.filterNews = [];//inicializando una variable como array sin elementos
                         //initializing a variable as an array with no elements

    //se guarda los resultados de la petincion // save the results of the request
    this.allNews  = await this.newsService.consultingNews(this.newSelected, this.pageScroll).toPromise();
    
    //se guarda la ultima pagina consultada // the last page viewed is saved
    this.pageUltState = this.allNews.page;

    //se suma 1 para que en la proxima consulta se consulte la proxima pagina // add 1 so that in the next query the next page is consulted
    this.pageUltState++; 


    await this.allNews.hits.forEach((e:any, i:number) => {

      //solo se van a agregar cuando alguno de estos datos no sean nulos
      //they will only be added when any of these data are not null
      if(e.author !== null && e.story_title !== null && e.story_url !== null && e.created_at !== null){
        e.indexFront = this.indexInsert;//se establece un indece unico por registro a agregar // a unique index is established per record to add
        e.fav = false;//se establece una propiedad para indicar que el registro no esta en favoritos // a property is set to indicate that the record is not in favorites
        this.filterNews.push(e);//se agrega en un array de datos filtrados // is added to an array of filtered data
        this.indexInsert++;//se suma ya que deben ser indexes autoincrementable // is added since indexes should be autoincrementable
      }
      
    });
    //si no existe datos en local storage y si no estamos con la opcion seleccionda de = 'Select your news'
    //if there is no data in local storage and if we are not with the selected option of = 'Select your news'
    if(localStorage.getItem(`${this.newSelected}NewsStorage`) === null && this.newSelected !== 'Select your news'){
      //se guardan los datos en local // data is saved locally
      localStorage.setItem(`${this.newSelected}lastPage`, `${this.pageScroll}`);//se guarda la ultima pagina consultada del api  // the last consulted page of the api is saved
      localStorage.setItem(`${this.newSelected}lastIndex`, `${this.indexInsert}`);//se guarda el ultimo indexes que se establecio en los datos filtrados // the last indexes that were established in the filtered data are saved
      localStorage.setItem(`${this.newSelected}NewsStorage`, JSON.stringify(this.filterNews));//se guardan los datos filtrados en local storage // the filtered data is saved in local storage
      localStorage.setItem(`selectfilter`, `${this.newSelected}`);//se guarda el valor del que esta seleccionado en el valor select // the value of which is selected is saved in the select value
      
    }
    //si estamos en la opcion marcada de "All" // if we are in the option marked "All"
    if(this.allNewsShow === true && this.favNewsShow === false){//
      //se muestran todos los datos // se muestran todos los datos
      this.filterNews  =  JSON.parse( localStorage.getItem(`${this.newSelected}NewsStorage`) || "[]");
      
    }
    //si estamos en la opcion marcada de "My faves" se muestran solo los favoritos por valor seleccionado
    //if we are in the marked option of "My faves" only the favorites by selected value are shown
    else{
      this.filterNews = JSON.parse(localStorage.getItem(`${this.newSelected}FavsStorage`) || "[]" );
      this.showFavNews();
    }

  }


  //para agregar favoritos // to add favorites
  async addFavorite(value:any, i:number, ev:Event){

      //se desactiva el comportamiento por defecto para que no actue como un hipervinculo
      //disable default behavior so it doesn't act like a hyperlink
      ev.preventDefault();

      this.modifiedNews = [];// se inicializa un array sin elementos // initialize an array with no elements

      //se obtiene los valores que estan guardados en local // get the values ​​that are stored locally
      let newsToModify =  JSON.parse(localStorage.getItem(`${this.newSelected}NewsStorage`) || "[] ");

      //se recorre todos los elementos que esta guardado en local // it goes through all the elements that are saved locally
      await newsToModify.forEach( (e:any, index:number) => {
        //si el elemento que se le da click es igual al que esta guardado en local
        //if the element that is clicked is the same as the one saved locally
        if(value.indexFront === index){

          //se va a modificar su propiedad para que sea favorito o deje de ser favorito
          // its property will be modified so that it is a favorite or stops being a favorite
          if(e.fav){
            e.fav = false; 
          }
          else{
            e.fav = true;
          }
          
        }
        //se agrega los elementos del array modificado a otro array
        // add the elements of the modified array to another array
        this.modifiedNews.push(e)
      })

      //si estas en la opcion "All" //if you are in the "All" option
      if(this.allNewsShow === true && this.favNewsShow === false){
        //se guarda el array modificado en local // save the modified array locally
        localStorage.setItem(`${this.newSelected}NewsStorage`, JSON.stringify(this.modifiedNews));
        //ahora se muestra toda esa informacion en la vista // now all that information is shown in the view
        this.filterNews  =  JSON.parse( localStorage.getItem(`${this.newSelected}NewsStorage`) || "[]");
      }
      else{
        //se guarda el array modificado en local  // save the modified array locally
        localStorage.setItem(`${this.newSelected}NewsStorage`, JSON.stringify(this.modifiedNews));

        //ahora se muestra toda esa informacion en la vista  // now all that information is shown in the view
        this.filterNews  =  JSON.parse( localStorage.getItem(`${this.newSelected}NewsStorage`) || "[]");

        //se llama la funcion para que se muestren los favoritos // the function is called so that the favorites are shown
        this.showFavNews();
      }
      
      
    }
    
}
