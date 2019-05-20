import { catchError, retry } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Util } from './utility';

export class HttpErrorInterceptor implements HttpInterceptor {
    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(retry(1), catchError((error: HttpErrorResponse) => {
            let errorMessage: string;
            if (!error.error.message) errorMessage = "¡Error de conexión!";
            else errorMessage = error.error.message;
            Util.dismissServerError(errorMessage, error.error.severity);
            return throwError(errorMessage);
        }));
    }
}