import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import {body} from './body.model';
import {freead} from './freead.model';
import {reportHacker} from './reportHacker.model';
import {Router} from '@angular/router';
import { Observable } from 'rxjs';
import { ErrorComponent } from '../error/error.component';
import { MatDialog } from '@angular/material/dialog';
@Injectable({
  providedIn: 'root'
})
export class BodyService {

  constructor(private http:HttpClient,private route:Router , private dialog:MatDialog) { }
  private formAdded:body = null;
  private random:number = null;
  private freeAd:freead = null;
  private randomFreeAd:number;
  private reportHacker:reportHacker = null;
  private randomreportHacker:number;
  private url:string = "http://localhost:3000/";
  ipAddress:string = null;
  getIpAddress():Observable<object>{
    if(this.ipAddress == null){
      return this.http.get("https://cors-anywhere.herokuapp.com/http://api.ipify.org/?format=json");
    }
    else{
      return new Observable( observer => {
        observer.next( {ip:this.ipAddress})
        observer.complete()
     })
    }
  }
  getVideoIdAndRegisterType():Observable<object>{
      return this.http.post<{register : boolean,videoId : string,videoType : string, adAppearanceCountry:string}>(this.url+'api/solo/registerGetAd',{ip:this.ipAddress});
  }
  /*checkUserName(userName){
    return this.http.get<{acceptData:boolean,error:boolean,oldUserName:string}>(this.url+'api/checksolousername?username='+userName);
  }*/
  checkGmailAccount(gmailAccount){
    return this.http.get<{acceptData:boolean,error:boolean,oldGmail:string}>(this.url+'api/solo/checkGmail?gmailaccount='+gmailAccount);
  }
  checkIdPubg(idPubg){
    return this.http.get<{acceptData:boolean,error:boolean,oldIdPubg:string}>(this.url+'api/solo/checkIdPubg?idpubg='+idPubg);
  }
  increaseVideoFinish(videoId:string,videoType:string,adAppearanceCountry:string){
    this.http.put(this.url+'api/solo/increaseVideo',{videoId:videoId,videoType:videoType,adAppearanceCountry:adAppearanceCountry})
    .subscribe();
  }
  getEmail(/*UserName:string,*/
    Email:string,
    pubgId:number,
    videoId:string){
      this.http.post<{random:number}>(this.url+'api/solo/sendEmailConfirm',{Email:Email})
      .subscribe((backRandom)=>{
        this.formAdded = {
          //userName:UserName,
          email:Email,
          pubgId : pubgId,
          videoId:videoId
        };
        this.random = backRandom.random;
        this.route.navigate(['/register/soloconfirmEmail']);
      } , error => {this.dialog.open(ErrorComponent)});
  }

  getFormAddedAndRandom(){
    if(this.formAdded == null || this.random == null){
      return false;
    }
    else{
      return true;
    }
  }

  checkRandom(randon:number){
    if(randon == this.random){
      return true;
    }
    else{
      return false;
    }
  }

  deleteRandom(){
    this.formAdded = null;
    this.random = null
  }

  sendData(randon:number){
    if(randon == this.random && this.random != null){
      return this.http.post<{message:string}>(this.url+'api/solo/sendData',this.formAdded);
    }
    else{
      return new Observable<{message:string}>( observer => {
        observer.next( {message:"error occure please register again"})
        observer.complete()
     })
    }
  }

   /*get date*/
  getVideoIdAndDateType():Observable<object>{
    return this.http.post<{dateAppearance : boolean,videoId : string,videoType : string , adAppearanceCountry:string}>(this.url+'api/solo/dateGetAd',{ip:this.ipAddress});
  }

  getPlayerDate(idPubg:string){
    return  this.http.get<{date:string , time:number,message:string}>(this.url+'api/solo/getPlayerDate?idpubg='+idPubg);
  }
  /*free ad*/
  getVideoIdAndFreeAdType():Observable<object>{
    return this.http.post<{freeAdResgister : boolean,videoId : string,videoType : string , adAppearanceCountry:string,adsWillAppear:Array<string>}>(this.url+'api/solo/freeAdGetAd',{ip:this.ipAddress});
  }

  /*checkUserNameFreeAd(userName){
    return this.http.get<{acceptData:boolean,error:boolean,oldUserName:string}>(this.url+'api/checksolousernamefreead?username='+userName);
  }*/
  checkGmailAccountFreeAd(gmailAccount){
    return this.http.get<{acceptData:boolean,error:boolean,oldGmail:string}>(this.url+'api/solo/checkGmailAccountFreeAd?gmailaccount='+gmailAccount);
  }
  checkYoutubeFreeAd(youtube){
    return this.http.get<{acceptData:boolean,error:boolean,oldYoutube:string}>(this.url+'api/solo/checkYoutubeFreeAd?youtube='+youtube);
  }
  getEmailFreeAd(/*UserName:string,*/
    Email:string,
    Youtube:string,
    Country:string,
    videoId:string){
      this.http.post<{random:number}>(this.url+'api/solo/sendEmailConfirm',{Email:Email})
      .subscribe((backRandom)=>{
        this.freeAd = {
          //userName:UserName,
          email:Email,
          Youtube : Youtube,
          Country:Country,
          videoId:videoId
        };
        this.randomFreeAd = backRandom.random;
        this.route.navigate(['/register/soloconfirmEmailFreeAd']);
      } , error => {this.dialog.open(ErrorComponent)});
  }
  getFormAddedAndRandomFreeAd(){
    if(this.freeAd == null || this.randomFreeAd == null){
      return false;
    }
    else{
      return true;
    }
  }

  checkRandomFreeAd(randon:number){
    if(randon == this.randomFreeAd){
      return true;
    }
    else{
      return false;
    }
  }

  deleteRandomFreeAd(){
    this.freeAd = null;
    this.randomFreeAd = null
  }

  sendDataFreeAd(randon:number){
    if(randon == this.randomFreeAd && this.randomFreeAd != null){
      return this.http.post<{message:string}>(this.url+'api/solo/sendDataFreeAd',this.freeAd) 
    }
    else{
      return new Observable<{message:string}>( observer => {
        observer.next( {message:"error occure please register again"})
        observer.complete()
     })
    }
  }
  /*report hacker */
  getReportHackerType():Observable<object>{
    return this.http.get<{reportHackerResgister : boolean,apperHackerAndWinners:boolean}>(this.url+'api/solo/reportHackerRegister');
  }
  checkGmailAccountReportHacker(gmailAccount){
    return this.http.get<{acceptData:boolean,error:boolean,oldGmail:string}>(this.url+'api/solo/checkGmailAccountHacker?gmailaccount='+gmailAccount);
  }
  checkGoogleDriveReportHacker(googleDrive){
    return this.http.get<{acceptData:boolean,error:boolean,oldGoogleDrive:string}>(this.url+'api/solo/checkGoogleDriveHacker?googledrive='+googleDrive);
  }
  getEmailReportHacker(
    Email:string,
    googleDrive:string){
      this.http.post<{random:number}>(this.url+'api/solo/sendEmailConfirm',{Email:Email})
      .subscribe((backRandom)=>{
        this.reportHacker = {
          email:Email,
          googleDrive : googleDrive,
        };
        this.randomreportHacker = backRandom.random;
        this.route.navigate(['/register/soloconfirmEmailHacker']);
      } , error => {this.dialog.open(ErrorComponent)});
  }
  getFormAddedAndRandomReportHacker(){
    if(this.reportHacker == null || this.randomreportHacker == null){
      return false;
    }
    else{
      return true;
    }
  }

  checkRandomReportHacker(randon:number){
    if(randon == this.randomreportHacker){
      return true;
    }
    else{
      return false;
    }
  }

  deleteRandomReportHacker(){
    this.reportHacker = null;
    this.randomreportHacker = null
  }

  sendDataReportHacker(randon:number){
    if(randon == this.randomreportHacker && this.randomreportHacker != null){
      return this.http.post<{message:string}>(this.url+'api/solo/sendDataHacker',this.reportHacker) 
    }
    else{
      return new Observable<{message:string}>( observer => {
        observer.next( {message:"error occure please register again"})
        observer.complete()
     })
    }
  }
  getPlayerState(idPubg:string){
    return this.http.get<string>(this.url+'api/solo/getPlayerState?idpubg='+idPubg);
  }
/*////////////////////////*/

  
  

  
  
  
  /*getNumberOfUser(){
    return this.http.post<{countUser : number,videoId:string}>(this.url+'api/getCount',this.userCountry);
  }*/
  /*admin function*/
  
  addSolo(){
    return this.http.get<string>(this.url+'api/solo/testaddSolo').subscribe();
  }
  addDuo(){
    return this.http.get<string>(this.url+'api/duo/testaddDuo').subscribe();
  }
  addSquad(){
    return this.http.get<string>(this.url+'api/squad/testaddSquad').subscribe();
  }
  addhackerswinners(){
    return this.http.get<string>(this.url+'api/squad/addhackerswinners').subscribe();
  }
}
