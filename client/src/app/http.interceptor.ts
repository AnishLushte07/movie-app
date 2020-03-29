import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let req = request;
    if (req.headers.get('ignoreAuthModule') === 'true') {
        return next.handle(req);
    }

    req = this.addAuthorizationHeader(req);

    return next.handle(req);
  }

  private addAuthorizationHeader(request: HttpRequest<any>): HttpRequest<any> {
    if (request.url.indexOf('/api') && !localStorage.getItem('token')) {
        const location = window.location;

        location.href = `http://localhost:4200/login`;
        return null;
    }

    return request.clone({
        setHeaders: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }
}
