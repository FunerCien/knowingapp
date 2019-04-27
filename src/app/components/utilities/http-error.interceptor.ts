import { catchError, retry } from 'rxjs/operators';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Util } from './utility';

export class HttpErrorInterceptor implements HttpInterceptor {
    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(retry(1), catchError((error: HttpErrorResponse) => {
            let errorMessage: string;
            if (error.error instanceof ErrorEvent) errorMessage = `Error: ${error.error.message}`;
            else errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            Util.dismissServerError();
            return throwError(errorMessage);
        }));
    }
}