import { HttpInterceptor, HttpRequest, HttpHandler, HttpEventType } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoggingInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('Outgoing request');
    console.log(req.url);
    return next.handle(req).pipe(
      tap(event=>{
        if (event.type===HttpEventType.Response){
          console.log('Incoming response');
          console.log(event.body);
        }
      })
    );
  }
}
