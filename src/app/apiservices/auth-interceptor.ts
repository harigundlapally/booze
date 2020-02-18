import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from './data-service.service';
 
@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    constructor( private service : DataService){}
    intercept(req : HttpRequest<any>,next : HttpHandler){
        const token = this.service.getToken();
        const authRequest = req.clone({
           headers : req.headers.set('Authorization', 'Bearer '+token) 
        });
        return next.handle(authRequest);
    }
}