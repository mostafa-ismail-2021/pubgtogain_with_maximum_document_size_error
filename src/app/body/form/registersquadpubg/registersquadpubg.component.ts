import { Component, OnInit, OnDestroy,NgZone } from '@angular/core';
import {SquadbodyService} from '../../squadbody.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {ErrorComponent} from '../../../error/error.component';
import {
  OnPageVisibilityChange,
  AngularPageVisibilityStateEnum} from 'angular-page-visibility';

@Component({
  selector: 'app-registersquadpubg',
  templateUrl: './registersquadpubg.component.html',
  styleUrls: ['./registersquadpubg.component.css']
})
export class RegistersquadpubgComponent implements OnInit , OnDestroy{

  constructor(private squadBodyService:SquadbodyService , private dialog:MatDialog,private ngZone: NgZone) { }
  public YT: any;
  public player: any;
  public reframed: boolean = false;
  public videoFinish :boolean = false;
  public register:boolean = false;
  public upVideo:string;
  /*public userNameType:boolean = false;
  public userNameDisable:boolean = false;
  public errorServerUserNameType:boolean = false;
  private timeOutUserfullName: any = null;
  private checkUserfullName:Subscription;
  private oldUserNameValue:string = null;
  public userNameText:string='User full Name';*/
  public gmailAccountType:boolean = false;
  public gmailAccountDisable:boolean = false;
  public errorServerGmailAccountType:boolean = false;
  public idPubgType:boolean = false;
  public idPubgDisable:boolean = false;
  public errorServerIdPubgType:boolean = false;
  public firstMemberIdPubgType:boolean = false;
  public firstMemberIdPubgDisable:boolean = false;
  public secondMemberIdPubgType:boolean = false;
  public secondMemberIdPubgDisable:boolean = false;
  public thirdMemberIdPubgType:boolean = false;
  public thirdMemberIdPubgDisable:boolean = false;
  public errorServerFirstMemberIdPubgType:boolean = false;
  public errorServerSecondMemberIdPubgType:boolean = false;
  public errorServerThirdMemberIdPubgType:boolean = false;
  public firstMemberExistIdPubgType:boolean = false;
  public secondMemberExistIdPubgType:boolean = false;
  public thirdMemberExistIdPubgType:boolean = false;
  public gmailText:string='gmail account';
  public pubgIdText:string='your id account in pubg';
  public firstMemberPubgIdText:string='your first friend id account in pubg';
  public secondMemberPubgIdText:string='your second friend id account in pubg';
  public thirdMemberPubgIdText:string='your third friend id account in pubg';
  public note:string='note : click on Register button After Video finished';
  public getDataOnServer:boolean = true;
  private videoType:string;
  private videoId:string;
  private adAppearanceCountry:string;
  private oldGmailAccountValue:string = null;
  private oldIdPubgValue:string = null;
  private oldFirstMemberIdPubgValue:string = null;
  private oldSecondMemberIdPubgValue:string = null;
  private oldThirdMemberIdPubgValue:string = null;
  private getIp:Subscription;
  private checkVideoIdAndRegisterType:Subscription;
  private checkGmailAccount:Subscription;
  private checkIdPubg:Subscription;
  private checkFirstMemberIdPubg:Subscription;
  private checkSecondMemberIdPubg:Subscription;
  private checkThirdMemberIdPubg:Subscription;
  private timeOutGmailAccount: any = null;
  private timeOutIdPubg: any = null;
  private timeOutFirstMemberIdPubg: any = null;
  private timeOutSecondMemberIdPubg: any = null;
  private timeOutThirdMemberIdPubg: any = null;
  private videoReady:boolean = false;
  private playercount:number = 0;
  
  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getIp = this.squadBodyService.getIpAddress().subscribe((ipData:{ip})=>{
      this.squadBodyService.ipAddress = ipData.ip;
      this.checkVideoIdAndRegisterType = this.squadBodyService.getVideoIdAndRegisterType().subscribe((data:{register:boolean , videoId:string , videoType:string , adAppearanceCountry:string}) =>{
        let _this = this;
        setTimeout(function () {
          _this.getDataOnServer = false;
          _this.addVideo();
        },3000);
        this.register = data.register;
        if(this.register == true)
        {
          this.upVideo = "the video will start now";
        }
        else{
          this.upVideo = "sorry the register finished";
        }
        this.videoId = data.videoId //video id
        this.videoType = data.videoType;
        this.adAppearanceCountry = data.adAppearanceCountry;
      },error => {this.dialog.open(ErrorComponent)})
    },error => {this.dialog.open(ErrorComponent)})
  }
  addVideo() {
    let $this = this;
    this.playercount++;
    setTimeout(function () {
      if(document.getElementById('squadplayer') != null || $this.playercount > 60)
      {
        try{
          $this.init();
          if(window['onYouTubeIframeAPIReady'] == undefined)
          {
            window['onYouTubeIframeAPIReady'] = (e) => {
              $this.YT = window['YT'];
              $this.reframed = false;
              $this.player = new window['YT'].Player('squadplayer', {
                videoId: $this.videoId,
                playerVars: { 
                  'autoplay': 1,
                  'controls': 1,
                  'rel' : 0,
                  'fs' : 0,
                },
                events: {
                  'onReady': $this.onPlayerReady.bind($this),
                  'onStateChange': $this.onPlayerStateChange.bind($this),
                  'onError': $this.onPlayerError.bind($this),
                }
              });
            };
          }
          else{
            $this.YT = window['YT'];
            $this.reframed = false;
            $this.player = new window['YT'].Player('squadplayer', {
              videoId: $this.videoId,
              playerVars: { 
                'autoplay': 1,
                'controls': 1,
                'rel' : 0,
                'fs' : 0,
              },
              events: {
                'onReady': $this.onPlayerReady.bind($this),
                'onStateChange': $this.onPlayerStateChange.bind($this),
                'onError': $this.onPlayerError.bind($this),
              }
            });
          }
        }
        catch(e){
          $this.dialog.open(ErrorComponent);
        }
      }
      else{
        $this.addVideo();
      }
    }, 1000);
  }
  init() {
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }
  
  @OnPageVisibilityChange()
  logWhenPageVisibilityChange ( visibilityState: AngularPageVisibilityStateEnum ): void {
    if ( AngularPageVisibilityStateEnum[visibilityState]
      === AngularPageVisibilityStateEnum[AngularPageVisibilityStateEnum.VISIBLE] && this.videoReady && !this.videoFinish) {
      this.player.playVideo();
    } else if (AngularPageVisibilityStateEnum[visibilityState]
      === AngularPageVisibilityStateEnum[AngularPageVisibilityStateEnum.HIDDEN] && this.videoReady && !this.videoFinish) {
      this.player.pauseVideo();
    }
  }

  onPlayerReady(event){
    if(this.register == true)
    {
      this.upVideo = "The video will disappear from the screen after it is completed";
    }
    event.target.playVideo();
    this.player.unMute();
    this.player.setVolume(65);
    this.videoReady = true;
  }
  addPerson(form:any)
  {
    if(form.value.Idpubg == form.value.firstMemberIdpubg ||form.value.firstMemberIdpubg ==  form.value.secondMemberIdpubg || form.value.firstMemberIdpubg == form.value.thirdMemberIdpubg){
      this.firstMemberIdPubgType = true;
      form.form.controls.firstMemberIdpubg.status = "INVALID";
      form.form.status = "INVALID";
    }
    else if(form.value.Idpubg == form.value.secondMemberIdpubg || form.value.secondMemberIdpubg == form.value.thirdMemberIdpubg){
      this.secondMemberIdPubgType = true;
      form.form.controls.secondMemberIdpubg.status = "INVALID";
      form.form.status = "INVALID";
    }
    else if(form.value.Idpubg == form.value.thirdMemberIdpubg){
      this.thirdMemberIdPubgType = true;
      form.form.controls.thirdMemberIdpubg.status = "INVALID";
      form.form.status = "INVALID";
    }
    else{
      this.squadBodyService.getEmail(
        /*this.oldUserNameValue,*/
        this.oldGmailAccountValue,
        form.value.Idpubg,
        form.value.firstMemberIdpubg,
        form.value.secondMemberIdpubg,
        form.value.thirdMemberIdpubg,
        this.videoId
        );
    }
  }
  onPlayerStateChange(event) {
    this.ngZone.run(() => {
    switch (event.data) {
      case window['YT'].PlayerState.ENDED:
        this.videoFinish = true;
        if(this.register == true)
        {
          this.upVideo = "Thanks for waiting for the video to finish";
        }
        this.note = 'note : if you register as team leader you can not register as member in another team';
        if(this.videoType != "noType"){
          this.squadBodyService.increaseVideoFinish(this.videoId , this.videoType,this.adAppearanceCountry);
        }
      break;
    };
  });
  };

  onPlayerError(event) {
    switch (event.data) {
      case 2:
        break;
      case 100:
        break;
      case 101 || 150:
        break;
    };
    
  };
  /*onKeyUpUserfullName(userName: any){
    let filteUserName = userName.value.toLowerCase();
    if(userName.valid){
      if(this.oldUserNameValue != filteUserName)
      {
        this.userNameDisable = false;
        this.userNameText = 'Please wait after completing your name';
        this.userNameType = false;
        this.errorServerUserNameType = false;
        this.oldUserNameValue = filteUserName;
        clearTimeout(this.timeOutUserfullName);
        let $this = this;
        this.timeOutUserfullName = setTimeout(function () {
          userName.control.touched = true;
          $this.checkUserfullName =   $this.squadBodyService.checkUserName($this.oldUserNameValue).subscribe((userNameType)=>{
            if($this.oldUserNameValue == userNameType.oldUserName && $this.userNameText == 'Please wait after completing your name')
            {
              $this.userNameText = 'User full Name';
              $this.userNameType = userNameType.acceptData;
              $this.userNameDisable = userNameType.acceptData;
              $this.errorServerUserNameType = userNameType.error;
              if(userNameType.acceptData == false || userNameType.error == true){
                userName.control.status = "INVALID";
              }
            }
          },error=>{console.log("error")})
        }, 3000);
      }
    }
    else{
      if(this.oldUserNameValue != filteUserName)
      {
        clearTimeout(this.timeOutUserfullName);
        this.oldUserNameValue = filteUserName;
        this.userNameText = 'User full Name';
        this.errorServerUserNameType = false;
        this.userNameType = true;
        this.userNameDisable = false;
      }
    }
  }*/
  onKeyUpGmailAccount(gmailAccount: any){
    let filteGmailAccont = gmailAccount.value.toLowerCase().split('.').join('').replace('@gmailcom','@gmail.com');
    if(gmailAccount.valid){
      if(this.oldGmailAccountValue != filteGmailAccont)
      {
        this.gmailAccountDisable = false;
        this.gmailText = 'Please wait after completing your gmail account';
        this.gmailAccountType = false;
        this.errorServerGmailAccountType = false;
        this.oldGmailAccountValue = filteGmailAccont;
        clearTimeout(this.timeOutGmailAccount);
        let $this = this;
        this.timeOutGmailAccount = setTimeout(function () {
          gmailAccount.control.touched = true;
          $this.checkGmailAccount =  $this.squadBodyService.checkGmailAccount($this.oldGmailAccountValue).subscribe((gmailAccountType)=>{
            if($this.oldGmailAccountValue == gmailAccountType.oldGmail && $this.gmailText == 'Please wait after completing your gmail account')
            {
              $this.gmailText = 'gmail account';
              $this.gmailAccountType = gmailAccountType.acceptData;
              $this.gmailAccountDisable = gmailAccountType.acceptData;
              $this.errorServerGmailAccountType = gmailAccountType.error;
              if(gmailAccountType.acceptData == false || gmailAccountType.error == true){
                gmailAccount.control.status = "INVALID";
              }
            }
          },error=>{console.log("error")})
        }, 3000);
      }
    }
    else{
      if(this.oldGmailAccountValue != filteGmailAccont)
      {
        clearTimeout(this.timeOutGmailAccount);
        this.oldGmailAccountValue = filteGmailAccont;
        this.gmailText = 'gmail account';
        this.errorServerGmailAccountType = false;
        this.gmailAccountType = true;
        this.gmailAccountDisable = false;
      }
    }
  }
  onKeyUpIdPubg(idPubg: any){
    if(idPubg.valid){
      if(this.oldIdPubgValue != idPubg.value)
      {
        this.idPubgDisable = false;
        this.pubgIdText = 'Please wait after completing your pubg id';
        this.idPubgType = false;
        this.errorServerIdPubgType = false;
        this.oldIdPubgValue = idPubg.value;
        clearTimeout(this.timeOutIdPubg);
        let $this = this;
        this.timeOutIdPubg = setTimeout(function () {
          idPubg.control.touched = true;
          $this.checkIdPubg =  $this.squadBodyService.checkIdPubg(idPubg.value).subscribe((idPubgType)=>{
            if($this.oldIdPubgValue == idPubgType.oldIdPubg && $this.pubgIdText == 'Please wait after completing your pubg id')
            {
              $this.pubgIdText = 'your id account in pubg';
              $this.idPubgType = idPubgType.acceptData;
              $this.idPubgDisable = idPubgType.acceptData;
              $this.errorServerIdPubgType = idPubgType.error;
              if(idPubgType.acceptData == false || idPubgType.error == true){
                idPubg.control.status = "INVALID";
              }
            }
          },error=>{console.log("error")})
        }, 3000);
      }
    }
    else{
      if(this.oldIdPubgValue != idPubg.value)
      {
        clearTimeout(this.timeOutIdPubg);
        this.oldIdPubgValue = idPubg.value;
        this.pubgIdText = 'your id account in pubg';
        this.errorServerIdPubgType = false;
        this.idPubgType = true;
        this.idPubgDisable = false;
      }
    }
  }
  onKeyUpfirstMemberIdPubg(firstMemberIdPubg: any){
    if(firstMemberIdPubg.valid){
      if(this.oldFirstMemberIdPubgValue != firstMemberIdPubg.value)
      {
        this.firstMemberIdPubgDisable = false;
        this.firstMemberPubgIdText = "Please wait after completing your friend's pubg id";
        this.firstMemberIdPubgType = false;
        this.firstMemberExistIdPubgType = false;
        this.errorServerFirstMemberIdPubgType = false;
        this.oldFirstMemberIdPubgValue = firstMemberIdPubg.value;
        clearTimeout(this.timeOutFirstMemberIdPubg);
        let $this = this;
        this.timeOutFirstMemberIdPubg = setTimeout(function () {
          firstMemberIdPubg.control.touched = true;
          $this.checkFirstMemberIdPubg =  $this.squadBodyService.checkMemberIdPubg(firstMemberIdPubg.value).subscribe((memberIdPubgType)=>{
            if($this.oldFirstMemberIdPubgValue == memberIdPubgType.oldMemberIdPubg && $this.firstMemberPubgIdText == "Please wait after completing your friend's pubg id")
            {
              $this.firstMemberPubgIdText = 'your friend id account in pubg';
              $this.firstMemberExistIdPubgType = memberIdPubgType.acceptData;
              $this.firstMemberIdPubgDisable = memberIdPubgType.acceptData;
              $this.errorServerFirstMemberIdPubgType = memberIdPubgType.error;
              if(memberIdPubgType.acceptData == false || memberIdPubgType.error == true){
                firstMemberIdPubg.control.status = "INVALID";
              }
            }
          },error=>{console.log("error")})
        }, 3000);
      }
    }
    else{
      if(this.oldFirstMemberIdPubgValue != firstMemberIdPubg.value)
      {
        clearTimeout(this.timeOutFirstMemberIdPubg);
        this.oldFirstMemberIdPubgValue = firstMemberIdPubg.value;
        this.firstMemberPubgIdText = 'your first friend id account in pubg';
        this.firstMemberIdPubgType = false;
        this.errorServerFirstMemberIdPubgType = false;
        this.firstMemberExistIdPubgType = true;
        this.firstMemberIdPubgDisable = false;
      }
    }
  }
  onKeyUpSecondMemberIdPubg(secondMemberIdPubg: any){
    if(secondMemberIdPubg.valid){
      if(this.oldSecondMemberIdPubgValue != secondMemberIdPubg.value)
      {
        this.secondMemberIdPubgDisable = false;
        this.secondMemberPubgIdText = "Please wait after completing your friend's pubg id";
        this.secondMemberIdPubgType = false;
        this.secondMemberExistIdPubgType = false;
        this.errorServerSecondMemberIdPubgType = false;
        this.oldSecondMemberIdPubgValue = secondMemberIdPubg.value;
        clearTimeout(this.timeOutSecondMemberIdPubg);
        let $this = this;
        this.timeOutSecondMemberIdPubg = setTimeout(function () {
          secondMemberIdPubg.control.touched = true;
          $this.checkSecondMemberIdPubg =  $this.squadBodyService.checkMemberIdPubg(secondMemberIdPubg.value).subscribe((memberIdPubgType)=>{
            if($this.oldSecondMemberIdPubgValue == memberIdPubgType.oldMemberIdPubg && $this.secondMemberPubgIdText == "Please wait after completing your friend's pubg id")
            {
              $this.secondMemberPubgIdText = 'your friend id account in pubg';
              $this.secondMemberExistIdPubgType = memberIdPubgType.acceptData;
              $this.secondMemberIdPubgDisable = memberIdPubgType.acceptData;
              $this.errorServerSecondMemberIdPubgType = memberIdPubgType.error;
              if(memberIdPubgType.acceptData == false || memberIdPubgType.error == true){
                secondMemberIdPubg.control.status = "INVALID";
              }
            }
          },error=>{console.log("error")})
        }, 3000);
      }
    }
    else{
      if(this.oldSecondMemberIdPubgValue != secondMemberIdPubg.value)
      {
        clearTimeout(this.timeOutSecondMemberIdPubg);
        this.oldSecondMemberIdPubgValue = secondMemberIdPubg.value;
        this.secondMemberPubgIdText = 'your second friend id account in pubg';
        this.secondMemberIdPubgType = false;
        this.errorServerSecondMemberIdPubgType = false;
        this.secondMemberExistIdPubgType = true;
        this.secondMemberIdPubgDisable = false;
      }
    }
  }
  onKeyUpThirdMemberIdPubg(thirdMemberIdPubg: any){
    if(thirdMemberIdPubg.valid){
      if(this.oldThirdMemberIdPubgValue != thirdMemberIdPubg.value)
      {
        this.thirdMemberIdPubgDisable = false;
        this.thirdMemberPubgIdText = "Please wait after completing your friend's pubg id";
        this.thirdMemberIdPubgType = false;
        this.thirdMemberExistIdPubgType = false;
        this.errorServerThirdMemberIdPubgType = false;
        this.oldThirdMemberIdPubgValue = thirdMemberIdPubg.value;
        clearTimeout(this.timeOutThirdMemberIdPubg);
        let $this = this;
        this.timeOutThirdMemberIdPubg = setTimeout(function () {
          thirdMemberIdPubg.control.touched = true;
          $this.checkThirdMemberIdPubg =  $this.squadBodyService.checkMemberIdPubg(thirdMemberIdPubg.value).subscribe((memberIdPubgType)=>{
            if($this.oldThirdMemberIdPubgValue == memberIdPubgType.oldMemberIdPubg && $this.thirdMemberPubgIdText == "Please wait after completing your friend's pubg id")
            {
              $this.thirdMemberPubgIdText = 'your friend id account in pubg';
              $this.thirdMemberExistIdPubgType = memberIdPubgType.acceptData;
              $this.thirdMemberIdPubgDisable = memberIdPubgType.acceptData;
              $this.errorServerThirdMemberIdPubgType = memberIdPubgType.error;
              if(memberIdPubgType.acceptData == false || memberIdPubgType.error == true){
                thirdMemberIdPubg.control.status = "INVALID";
              }
            }
          },error=>{console.log("error")})
        }, 3000);
      }
    }
    else{
      if(this.oldThirdMemberIdPubgValue != thirdMemberIdPubg.value)
      {
        clearTimeout(this.timeOutThirdMemberIdPubg);
        this.oldThirdMemberIdPubgValue = thirdMemberIdPubg.value;
        this.thirdMemberPubgIdText = 'your third friend id account in pubg';
        this.thirdMemberIdPubgType = false;
        this.errorServerThirdMemberIdPubgType = false;
        this.thirdMemberExistIdPubgType = true;
        this.thirdMemberIdPubgDisable = false;
      }
    }
  }
  ngOnDestroy():void{
    if(this.getIp){
      this.getIp.unsubscribe();
    }
    if(this.checkVideoIdAndRegisterType){
      this.checkVideoIdAndRegisterType.unsubscribe();
    }
    /*if(this.checkUserfullName){
      this.checkUserfullName.unsubscribe();
    }*/
    if(this.checkGmailAccount){
      this.checkGmailAccount.unsubscribe();
    }
    if(this.checkIdPubg){
      this.checkIdPubg.unsubscribe();
    }
    if(this.checkFirstMemberIdPubg){
      this.checkFirstMemberIdPubg.unsubscribe();
    }
    if(this.checkSecondMemberIdPubg){
      this.checkSecondMemberIdPubg.unsubscribe();
    }
    if(this.checkThirdMemberIdPubg){
      this.checkThirdMemberIdPubg.unsubscribe();
    }
  }
}