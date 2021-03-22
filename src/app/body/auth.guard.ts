import {Observable } from "rxjs";
import {Injectable} from '@angular/core';
import {authService} from './auth.service';
import {
    ActivatedRouteSnapshot, 
    CanActivate, 
    RouterStateSnapshot,
    Router
} from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private authService:authService , private route:Router){}
    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean>{
        const isAuth = this.authService.getIsAuth();
        if(!isAuth){
            this.route.navigate(['/']);
        }
        return isAuth;
    }
}