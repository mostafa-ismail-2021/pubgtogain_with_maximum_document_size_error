import { Component, OnInit, OnDestroy,NgZone } from '@angular/core';
import {DuobodyService} from '../../duobody.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {ErrorComponent} from '../../../error/error.component';
import {
  OnPageVisibilityChange,
  AngularPageVisibilityStateEnum} from 'angular-page-visibility';

@Component({
  selector: 'app-registerduopubg',
  templateUrl: './registerduopubg.component.html',
  styleUrls: ['./registerduopubg.component.css']
})
export class RegisterduopubgComponent implements OnInit , OnDestroy {

  constructor(private duoBodyService:DuobodyService , private dialog:MatDialog,private ngZone: NgZone) { }
  public YT: any;
  public player: any;
  public reframed: boolean = false;
  public videoFinish :boolean = false;
  public register:boolean = false;
  public upVideo:string;
  /*public userNameType:boolean = false;
  public userNameDisable:boolean = false;
  public errorServerUserNameType:boolean = false;
  public userNameText:string='User full Name';
  private oldUserNameValue:string = null;
  private timeOutUserfullName: any = null;
  private checkUserfullName:Subscription;*/
  public gmailAccountType:boolean = false;
  public gmailAccountDisable:boolean = false;
  public errorServerGmailAccountType:boolean = false;
  public idPubgType:boolean = false;
  public idPubgDisable:boolean = false;
  public errorServerIdPubgType:boolean = false;
  public memberIdPubgType:boolean = false;
  public memberIdPubgDisable:boolean = false;
  public errorServerMemberIdPubgType:boolean = false;
  public memberExistIdPubgType:boolean = false;
  public gmailText:string='gmail account';
  public pubgIdText:string='your id account in pubg';
  public memberPubgIdText:string='your friend id account in pubg';
  public note:string='note : click on Register button After Video finished';
  public getDataOnServer:boolean = true;
  private videoType:string;
  private videoId:string;
  private adAppearanceCountry:string;
  private oldGmailAccountValue:string = null;
  private oldIdPubgValue:string = null;
  private oldMemberIdPubgValue:string = null;
  private getIp:Subscription;
  private checkVideoIdAndRegisterType:Subscription;
  private checkGmailAccount:Subscription;
  private checkIdPubg:Subscription;
  private checkMemberIdPubg:Subscription;
  private timeOutGmailAccount: any = null;
  private timeOutIdPubg: any = null;
  private timeOutMemberIdPubg: any = null;
  private videoReady:boolean = false;
  private playercount:number = 0;

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getIp = this.duoBodyService.getIpAddress().subscribe((ipData:{ip})=>{
      this.duoBodyService.ipAddress = ipData.ip;
      this.checkVideoIdAndRegisterType = this.duoBodyService.getVideoIdAndRegisterType().subscribe((data:{register:boolean , videoId:string , videoType:string , adAppearanceCountry:string}) =>{
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
      if(document.getElementById('duoplayer') != null || $this.playercount > 60)
      {
        try{
          $this.init();
          if(window['onYouTubeIframeAPIReady'] == undefined)
          {
            window['onYouTubeIframeAPIReady'] = (e) => {
              $this.YT = window['YT'];
              $this.reframed = false;
              $this.player = new window['YT'].Player('duoplayer', {
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
            $this.player = new window['YT'].Player('duoplayer', {
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
    if(form.value.Idpubg == form.value.memberIdpubg){
      this.memberIdPubgType = true;
      form.form.controls.memberIdpubg.status = "INVALID";
      form.form.status = "INVALID";
    }
    else{
      this.duoBodyService.getEmail(
        //this.oldUserNameValue,
        this.oldGmailAccountValue,
        form.value.Idpubg,
        form.value.memberIdpubg,
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
          this.duoBodyService.increaseVideoFinish(this.videoId , this.videoType,this.adAppearanceCountry);
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
          $this.checkUserfullName =   $this.duoBodyService.checkUserName($this.oldUserNameValue).subscribe((userNameType)=>{
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
          $this.checkGmailAccount =  $this.duoBodyService.checkGmailAccount($this.oldGmailAccountValue).subscribe((gmailAccountType)=>{
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
          $this.checkIdPubg =  $this.duoBodyService.checkIdPubg(idPubg.value).subscribe((idPubgType)=>{
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
  onKeyUpMemberIdPubg(memberIdPubg: any){
    if(memberIdPubg.valid){
      if(this.oldMemberIdPubgValue != memberIdPubg.value)
      {
        this.memberIdPubgDisable = false;
        this.memberPubgIdText = "Please wait after completing your friend's pubg id";
        this.memberIdPubgType = false;
        this.memberExistIdPubgType = false;
        this.errorServerMemberIdPubgType = false;
        this.oldMemberIdPubgValue = memberIdPubg.value;
        clearTimeout(this.timeOutMemberIdPubg);
        let $this = this;
        this.timeOutMemberIdPubg = setTimeout(function () {
          memberIdPubg.control.touched = true;
          $this.checkMemberIdPubg =  $this.duoBodyService.checkMemberIdPubg(memberIdPubg.value).subscribe((memberIdPubgType)=>{
            if($this.oldMemberIdPubgValue == memberIdPubgType.oldMemberIdPubg && $this.memberPubgIdText == "Please wait after completing your friend's pubg id")
            {
              $this.memberPubgIdText = 'your friend id account in pubg';
              $this.memberExistIdPubgType = memberIdPubgType.acceptData;
              $this.memberIdPubgDisable = memberIdPubgType.acceptData;
              $this.errorServerMemberIdPubgType = memberIdPubgType.error;
              if(memberIdPubgType.acceptData == false || memberIdPubgType.error == true){
                memberIdPubg.control.status = "INVALID";
              }
            }
          },error=>{console.log("error")})
        }, 3000);
      }
    }
    else{
      if(this.oldMemberIdPubgValue != memberIdPubg.value)
      {
        clearTimeout(this.timeOutMemberIdPubg);
        this.oldMemberIdPubgValue = memberIdPubg.value;
        this.memberPubgIdText = 'your friend id account in pubg';
        this.memberIdPubgType = false;
        this.errorServerMemberIdPubgType = false;
        this.memberExistIdPubgType = true;
        this.memberIdPubgDisable = false;
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
    if(this.checkMemberIdPubg){
      this.checkMemberIdPubg.unsubscribe();
    }
  }
}