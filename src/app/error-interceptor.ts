import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http"
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

export class ErrorInterceptor implements HttpInterceptor{

    intercept( req: HttpRequest<any>, next: HttpHandler){
        return next.handle(req).pipe(
            catchError((err: HttpErrorResponse)=>{
                console.log(err);
                return throwError(err);
            })
        )
    }
}