import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class adminpaidad {
    private url:string = "http://localhost:3000/";

    constructor(private http:HttpClient) { }

    addPaidAdToServer(paidAd:object){console.log(paidAd);
        return this.http.post<{message:string}>(this.url + "api/paidads/addPaidAd" , {paidAd:paidAd});
    }
    getPaidAds(){
        return this.http.get<Array<object>>(this.url + "api/paidads/getPaidAds");
    }
    getPaidAdsNot(){
        return this.http.get<Array<object>>(this.url + "api/paidads/getPaidAdsNot");
    }
    getPaidAdsCompany(companyName:string){
        return this.http.post<Array<object>>(this.url + "api/paidads/getPaidAdsCompany" , {companyName:companyName});
    }
    deletePaidAd(_id:string){
        return this.http.post<{message:string}>(this.url + "api/paidads/deletePaidAd" , {_id:_id});
    }
}