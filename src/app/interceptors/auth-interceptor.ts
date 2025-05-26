import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the auth token from the service
    const authToken = this.authService.getToken();
    
    // Skip adding token for authentication endpoints
    if (request.url.includes('/no-auth/')) {
      console.log('Skipping auth header for auth endpoint:', request.url);
      return next.handle(request).pipe(
        tap({
          next: (event) => {},
          error: (error) => {
            console.error('HTTP error in auth endpoint:', error);
          }
        })
      );
    }

    // Clone the request and add the token if available
    if (authToken) {
      console.log('Adding auth token to request:', request.url);
      const authReq = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${authToken}`)
      });
      return next.handle(authReq).pipe(
        tap({
          next: (event) => {},
          error: (error) => {
            console.error('HTTP error in authenticated request:', error);
          }
        })
      );
    }
    
    console.log('No auth token available for request:', request.url);
    return next.handle(request).pipe(
      tap({
        next: (event) => {},
        error: (error) => {
          console.error('HTTP error in unauthenticated request:', error);
        }
      })
    );
  }
}
