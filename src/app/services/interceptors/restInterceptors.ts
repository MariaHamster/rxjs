import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {UserService} from "../user/user/user.service";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class RestInterceptorsService implements  HttpInterceptor {
  constructor(private UserService: UserService) {

  }

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {

    const hasToken = this.UserService.getToken();
    //console.log('hasToken', hasToken)
    if (hasToken) {
      //console.log('hasToken', hasToken)

      const cloned = req.clone({
        headers: req.headers.set("Authorization", "Bearer" + hasToken)
      });

      return next.handle(cloned);
      } else {
      return next.handle(req);
    }
  }
}
