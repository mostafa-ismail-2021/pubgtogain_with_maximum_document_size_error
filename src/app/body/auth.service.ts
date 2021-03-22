import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import {AuthData} from './auth-data.model';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class authService {

    private url:string = "http://localhost:3000/";
    private token:string;
    private isAuthinticated:boolean = false;
    private authStatusListener = new Subject<boolean>();
    private tokenTimer:any;

    constructor(private http:HttpClient , private route:Router) { }
    getToken(){
        return this.token;
    }
    getIsAuth(){
        return this.isAuthinticated;
    }
    getauthStatusListener(){
        return this.authStatusListener.asObservable();
    }
    login(email:string , password:string){
        const authData:AuthData = {email : email , password : password}
        return new Observable(observer => {
            this.http.post<{createToken:boolean,token:string , expiresIn:number}>(this.url +'api/admin/login' , authData)
            .subscribe(data =>{
                this.token = data.token;
                if(data.createToken)
                {
                    const expireInDuration = data.expiresIn;
                    this.setAuthTimer(expireInDuration)
                    this.authStatusListener.next(true);
                    this.isAuthinticated = true;
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expireInDuration * 1000);
                    this.saveAuthData(this.token , expirationDate);
                }
              observer.next(data.createToken);
              observer.complete();
            });
          })
    }

    autoAuthUser(){
        const authInformation = this.getAuthData();
        if(!authInformation){
            return ;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if(expiresIn > 0){
            this.token = authInformation.token;
            this.isAuthinticated = true;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    logout(){
        this.token = null;
        this.authStatusListener.next(false);
        this.isAuthinticated = false;
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.route.navigate(['/']);
    }

    private setAuthTimer(duration:number){
        let _this = this;
        this.tokenTimer = setTimeout(function () {
            _this.logout();
        },duration * 1000);
    }

    private saveAuthData(token:string , expirationDate:Date){
        localStorage.setItem("token" , token);
        localStorage.setItem("expiration" , expirationDate.toISOString());
    }

    private clearAuthData(){
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
    }

    private getAuthData(){
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration");
        if(!token || !expirationDate){
            return ;
        }
        return {
            token : token,
            expirationDate : new Date(expirationDate)
        }
    }
}