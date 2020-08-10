import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GroceriesService {

  items: any = [];

  dataChanged$: Observable<boolean>;

  private dataChangeSubject: Subject<boolean>;

  baseURL = "http://groceries-server-mgutierrez2.herokuapp.com";

  constructor(public http: HttpClient) {
    console.log("Hello Groceries Service Provider");

    this.dataChangeSubject = new Subject<boolean>();
    this.dataChanged$ = this.dataChangeSubject.asObservable();
  }

 // Function for loading grocery items
  get_items(): Observable<object[]> {
    return this.http.get(this.baseURL + '/api/groceries').pipe(
      map(this.extractData),
      catchError(this.handleError)
      );
  }

  private extractData(res: Response) {
    let body = res;
    return (body || {}) as object[];
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const err = error || '';
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  // Function for removing grocery items
  remove_item(item){
    console.log("#### Remove Item - id = ", item);
    this.http.delete(this.baseURL + "/api/groceries/" + item._id).subscribe(res => {
      this.items = res;
      this.dataChangeSubject.next(true);
    });
  }

  // Function for adding grocery items
  add_item(item) {
    console.log("Adding item = ", item);
    this.http.post(this.baseURL + "/api/groceries/", item).subscribe(res => {
      this.items = res;
      this.dataChangeSubject.next(true);
    });
  }

  // Function for editing grocery items
  edit_item(item, index){
    console.log("Editing item = ", item);
    this.http.put(this.baseURL + "/api/groceries/" + item._id, item).subscribe(res => {
      this.items[index] = res;
      this.dataChangeSubject.next(true);
    });
  }
  
}
