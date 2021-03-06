import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

  constructor(
    private router: Router
  ) { }

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    if (err.status === 401 || err.status === 403) {
      localStorage.clear();
      this.router.navigateByUrl(`/login`);

      return of(err);
    }
    return throwError(err);
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let req = request;
    if (req.headers.get('ignoreAuthModule') === 'true') {
      return next.handle(req);
    }

    req = this.addAuthorizationHeader(req);

    return next.handle(req)
      .pipe(catchError(x => this.handleAuthError(x)));;
  }

  private addAuthorizationHeader(request: HttpRequest<any>): HttpRequest<any> {
    if (request.url.indexOf('/api') && !localStorage.getItem('token')) {
      const location = window.location;

      this.router.navigateByUrl(`/login`);
      return null;
    }

    return request.clone({
      setHeaders: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }
}
