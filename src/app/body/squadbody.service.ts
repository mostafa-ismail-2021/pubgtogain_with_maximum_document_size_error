import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import {squadbody} from './squadbody.model';
import {squadbodymember} from './squadbodymember.model';
import {Router} from '@angular/router';
import { Observable } from 'rxjs';
import { ErrorComponent } from '../error/error.component';
import { MatDialog } from '@angular/material/dialog';
import {freead} from './freead.model';
import {reportHacker} from './reportHacker.model';

@Injectable({
  providedIn: 'root'
})
export class SquadbodyService {

  constructor(private http:HttpClient,private route:Router , private dialog:MatDialog) { }
  private formAdded:squadbody = null;
  private random:number = null;
  private url:string = "http://localhost:3000/";
  private memberFormAdded:squadbodymember = null;
  private memberRandom:number = null;
  private placeIdPubg:string ="not exist";
  private freeAd:freead = null;
  private randomFreeAd:number;
  private reportHacker:reportHacker = null;
  private randomreportHacker:number;
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
    return this.http.post<{register : boolean,videoId : string,videoType : string, adAppearanceCountry:string}>(this.url+'api/squad/teamLeaderReGetAd',{ip:this.ipAddress});
  }
  increaseVideoFinish(videoId:string,videoType:string,adAppearanceCountry:string){
    this.http.put(this.url+'api/squad/increaseVideoId',{videoId:videoId,videoType:videoType,adAppearanceCountry:adAppearanceCountry})
    .subscribe();
  }
  /*checkUserName(userName){
    return this.http.get<{acceptData:boolean,error:boolean,oldUserName:string}>(this.url+'api/checksquadtlusername?username='+userName);
  }*/
  checkGmailAccount(gmailAccount){
    return this.http.get<{acceptData:boolean,error:boolean,oldGmail:string}>(this.url+'api/squad/checkTLGmailAccount?gmailaccount='+gmailAccount);
  }
  checkIdPubg(idPubg){
    return this.http.get<{acceptData:boolean,error:boolean,oldIdPubg:string}>(this.url+'api/squad/checkTLIdPubg?idpubg='+idPubg);
  }
  checkMemberIdPubg(memberIdPubg){
    return this.http.get<{acceptData:boolean,error:boolean,oldMemberIdPubg:string}>(this.url+'api/squad/checkTLFIdPubg?idpubg='+memberIdPubg);
  }
  getEmail(
    /*UserName:string,*/
    Email:string,
    pubgId:number,
    firstMemberIdpubg:number,
    secondMemberIdpubg:number,
    thirdMemberIdpubg:number,
    videoId:string){
      this.http.post<{random:number}>(this.url+'api/squad/sendEmailConfirm',{Email:Email})
      .subscribe((backRandom)=>{
        this.formAdded = {
          /*userName:UserName,*/
          email:Email,
          pubgId : pubgId,
          firstMemberPubgId:firstMemberIdpubg,
          secondMemberPubgId:secondMemberIdpubg,
          thirdMemberPubgId:thirdMemberIdpubg,
          videoId:videoId
        };
        this.random = backRandom.random;
        this.route.navigate(['/register/squadteamleaderconfirmEmail']);
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
      return this.http.post<{message:string}>(this.url+'api/squad/tLSendData',this.formAdded) 
    }
    else{
      return new Observable<{message:string}>( observer => {
        observer.next( {message:"error occure please register again"})
        observer.complete()
     })
    }
  }
  
  /*member*/
  getMemberVideoIdAndRegisterType():Observable<object>{
    return this.http.post<{register : boolean,videoId : string,videoType : string, adAppearanceCountry:string}>(this.url+'api/squad/memberReGetAd',{ip:this.ipAddress});
  }
  /*checkMemberUserName(userName){
    return this.http.get<{acceptData:boolean,error:boolean,oldUserName:string}>(this.url+'api/checksquadmusername?username='+userName);
  }*/
  checkMemberGmailAccount(gmailAccount){
    return this.http.get<{acceptData:boolean,error:boolean,oldGmail:string}>(this.url+'api/squad/checkMGmailAccount?gmailaccount='+gmailAccount);
  }
  getMemberEmail(
    Email:string,
    pubgId:number,
    teamLeaderIdpubg:number){
      return new Observable(observer => {
        this.http.post<{random:number,checkIdPubg:boolean , checkTeamleaderIdPubg:boolean, checkExistsBefore:boolean , error:boolean,PlaceIdPubg:string}>(this.url+'api/squad/sendMEmailConfirm',{Email : Email, pubgId : pubgId , teamLeaderIdpubg : teamLeaderIdpubg})
        .subscribe(data=>{
          this.memberRandom = data.random;
          this.placeIdPubg =data.PlaceIdPubg;
          observer.next({checkIdPubg:data.checkIdPubg , checkTeamleaderIdPubg:data.checkTeamleaderIdPubg , checkExistsBefore:data.checkExistsBefore , error:data.error});
          observer.complete();
        });
      })
  }
  confirmMemberEmail(/*UserName:string,*/
    Email:string,
    pubgId:number,
    teamLeaderIdpubg:number,
    videoId:string){
      this.memberFormAdded = {
        /*userName:UserName,*/
        email:Email,
        pubgId : pubgId,
        memberPubgId:teamLeaderIdpubg,
        placeIdPubg:this.placeIdPubg,
        videoId:videoId,
      };
      this.route.navigate(['/register/squadmemberconfirmEmail']);
  }
  getMemberFormAddedAndRandom(){
    if(this.memberFormAdded == null || this.memberRandom == null){
      return false;
    }
    else{
      return true;
    }
  }
  checkMemberRandom(randon:number){
    if(randon == this.memberRandom){
      return true;
    }
    else{
      return false;
    }
  }
  deleteMemberRandom(){
    this.memberFormAdded = null;
    this.memberRandom = null
  }
  sendMemberData(randon:number){
    if(randon == this.memberRandom && this.memberRandom != null){
      return this.http.post<{message:string}>(this.url+'api/squad/mSendData',this.memberFormAdded) 
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
    return this.http.post<{dateAppearance : boolean,videoId : string,videoType : string , adAppearanceCountry:string}>(this.url+'api/squad/dateGetAd',{ip:this.ipAddress});
  }

  getPlayerDate(idPubg:string){
    return  this.http.get<{date:string , time:number,message:string}>(this.url+'api/squad/getPlayerDate?idpubg='+idPubg);
  }
  /*free ad*/
  getVideoIdAndFreeAdType():Observable<object>{
    return this.http.post<{freeAdResgister : boolean,videoId : string,videoType : string , adAppearanceCountry:string,adsWillAppear:Array<string>}>(this.url+'api/squad/freeAdGetAd',{ip:this.ipAddress});
  }

  /*checkUserNameFreeAd(userName){
    return this.http.get<{acceptData:boolean,error:boolean,oldUserName:string}>(this.url+'api/checksquadusernamefreead?username='+userName);
  }*/
  checkGmailAccountFreeAd(gmailAccount){
    return this.http.get<{acceptData:boolean,error:boolean,oldGmail:string}>(this.url+'api/squad/checkGmailAccountFreeAd?gmailaccount='+gmailAccount);
  }
  checkYoutubeFreeAd(youtube){
    return this.http.get<{acceptData:boolean,error:boolean,oldYoutube:string}>(this.url+'api/squad/checkYoutubeFreeAd?youtube='+youtube);
  }
  getEmailFreeAd(/*UserName:string,*/
    Email:string,
    Youtube:string,
    Country:string,
    videoId:string){
      this.http.post<{random:number}>(this.url+'api/squad/sendEmailConfirm',{Email:Email})
      .subscribe((backRandom)=>{
        this.freeAd = {
          /*userName:UserName,*/
          email:Email,
          Youtube : Youtube,
          Country:Country,
          videoId:videoId
        };
        this.randomFreeAd = backRandom.random;
        this.route.navigate(['/register/squadconfirmEmailFreeAd']);
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
      return this.http.post<{message:string}>(this.url+'api/squad/sendDataFreeAd',this.freeAd) 
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
    return this.http.get<{reportHackerResgister : boolean,apperHackerAndWinners:boolean}>(this.url+'api/squad/reportHackerRegister');
  }
  checkGmailAccountReportHacker(gmailAccount){
    return this.http.get<{acceptData:boolean,error:boolean,oldGmail:string}>(this.url+'api/squad/checkGmailAccountHacker?gmailaccount='+gmailAccount);
  }
  checkGoogleDriveReportHacker(googleDrive){
    return this.http.get<{acceptData:boolean,error:boolean,oldGoogleDrive:string}>(this.url+'api/squad/checkGoogleDriveHacker?googledrive='+googleDrive);
  }
  getEmailReportHacker(
    Email:string,
    googleDrive:string){
      this.http.post<{random:number}>(this.url+'api/squad/sendEmailConfirm',{Email:Email})
      .subscribe((backRandom)=>{
        this.reportHacker = {
          email:Email,
          googleDrive : googleDrive,
        };
        this.randomreportHacker = backRandom.random;
        this.route.navigate(['/register/squadconfirmEmailHacker']);
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
      return this.http.post<{message:string}>(this.url+'api/squad/sendDataHacker',this.reportHacker) 
    }
    else{
      return new Observable<{message:string}>( observer => {
        observer.next( {message:"error occure please register again"})
        observer.complete()
     })
    }
  }
  getPlayerState(idPubg:string){
    return  this.http.get<string>(this.url+'api/squad/getPlayerState?idpubg='+idPubg);
  }
}