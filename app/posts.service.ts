import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from '@angular/common/http';
import { Post } from './post.model';
import { Subject } from 'rxjs/Subject';
import { map, catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  error = new Subject<string>();

  constructor(private http: HttpClient) { }

  createAndStorePost(title:string, content:string){
    const postData:Post = { title: title, content: content }
    return this.http.post<Post>(
                                'https://ng-complete-guide1-b81b2-default-rtdb.firebaseio.com/post.json',
                                postData,
                                {
                                  observe: 'response'
                                });
  }

  fetchPosts(){
    //this.isFetching = true;
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print','pretty'); //Because they are immutable
    searchParams = searchParams.append('custom','somekey');
    return this.http.get<{[key:string]:Post}>('https://ng-complete-guide1-b81b2-default-rtdb.firebaseio.com/post.json',
          {
            headers: new HttpHeaders({"Custom-Header":"Hello"}),
            params: searchParams 
            //new HttpParams().set('print','pretty') //equivalent to do it in the url
          }
        )
        .pipe(
              map(responseData=>{
                                  console.log(responseData);
                                  const postArray: Post[] = [];
                                  for (const key in responseData){
                                    console.log(key);
                                    if (responseData.hasOwnProperty(key)){ //not coming from prototype
                                      postArray.push({id:key, ...responseData[key]})
                                    }
                                  }
                                  return postArray;
                                }),
              catchError(errorRes=>{
                //Suggestion Send to Analytics Server
                return throwError(errorRes);
              }));
  }

  deleteAllPosts(){
    return this.http
           .delete<Post[]>('https://ng-complete-guide1-b81b2-default-rtdb.firebaseio.com/post.json',      
                            {
                              observe:'events',
                              responseType: 'json' //text,json,blob
                            })
                            .pipe(
                              tap(event=>{
                                console.log(event);
                                if (event.type === HttpEventType.Response){
                                  console.log(event.body);
                                }
                              })
                            );        
  }
}
