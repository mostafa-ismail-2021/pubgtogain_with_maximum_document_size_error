import { Component, OnInit, OnDestroy,NgZone } from '@angular/core';
import {SquadbodyService} from '../../squadbody.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {ErrorComponent} from '../../../error/error.component';
import {
  OnPageVisibilityChange,
  AngularPageVisibilityStateEnum} from 'angular-page-visibility';

@Component({
  selector: 'app-registersquadpubgmember',
  templateUrl: './registersquadpubgmember.component.html',
  styleUrls: ['./registersquadpubgmember.component.css']
})
export class RegistersquadpubgmemberComponent implements OnInit ,OnDestroy {

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
  public userNameText:string = 'User full Name';
  private timeOutUserfullName: any = null;
  private checkUserfullName:Subscription;
  private oldUserNameValue:string = null;*/
  public idPubgType:boolean = false;
  public errorServerIdPubgType:boolean = false;
  public memberIdPubgType:boolean = false;
  public gmailAccountType:boolean = false;
  public gmailAccountDisable:boolean = false;
  public errorServerGmailAccountType:boolean = false;
  public gmailText:string = 'gmail account';
  public idPubgText:string = 'your id account in pubg';
  public memberIdPubgText:string = 'team leader id account in pubg';
  public disableButton:boolean = false;
  public memberRegisterExistsBefore:boolean = false;
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
  private getEmail:Subscription;
  private timeOutGmailAccount: any = null;
  private videoReady:boolean = false;
  private click:number = 0;
  private playercount:number = 0;
  
  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getIp = this.squadBodyService.getIpAddress().subscribe((ipData:{ip})=>{
      this.squadBodyService.ipAddress = ipData.ip;
      this.checkVideoIdAndRegisterType = this.squadBodyService.getMemberVideoIdAndRegisterType().subscribe((data:{register:boolean , videoId:string , videoType:string , adAppearanceCountry:string}) =>{
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
      if(document.getElementById('squadmemberplayer') != null || $this.playercount > 60)
      {
        try{
          $this.init();
          if(window['onYouTubeIframeAPIReady'] == undefined)
          {
            window['onYouTubeIframeAPIReady'] = (e) => {
              $this.YT = window['YT'];
              $this.reframed = false;
              $this.player = new window['YT'].Player('squadmemberplayer', {
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
            $this.player = new window['YT'].Player('squadmemberplayer', {
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
  addMemberPerson(form:any,target:HTMLElement)
  {//console.log(form);form.form.controls.Email.status = "INVALID";form.form.status = "INVALID"
    if(this.click <= 6){
      this.disableButton = true;
      this.idPubgText = 'Please wait';
      this.memberIdPubgText = 'Please wait';
      this.click++;
      this.oldIdPubgValue = form.form.value.Idpubg;
      this.oldMemberIdPubgValue = form.form.value.teamLeaderIdpubg;
      this.getEmail = this.squadBodyService.getMemberEmail(
        //form.value.userName,
        this.oldGmailAccountValue ,
        form.form.value.Idpubg,
        form.form.value.teamLeaderIdpubg,
        ).subscribe((data:{checkIdPubg:boolean ,checkTeamleaderIdPubg:boolean , checkExistsBefore:boolean ,error:boolean}) =>{
          if(data.error){
            this.disableButton = false;
            this.idPubgText = 'your id account in pubg';
            this.memberIdPubgText = 'team leader id account in pubg';
            this.errorServerIdPubgType = true;
            form.form.controls.Idpubg.status = "INVALID";
            form.form.status = "INVALID";
          }
          else if(data.checkExistsBefore)
          {
            this.disableButton = false;
            this.idPubgText = 'your id account in pubg';
            this.memberIdPubgText = 'team leader id account in pubg';
            this.memberRegisterExistsBefore = true;
            form.form.controls.Idpubg.status = "INVALID";
            form.form.status = "INVALID";
          }
          else if(data.checkIdPubg){
            this.disableButton = false;
            this.idPubgText = 'your id account in pubg';
            this.memberIdPubgText = 'team leader id account in pubg';
            this.idPubgType = true;
            form.form.controls.Idpubg.status = "INVALID";
            form.form.status = "INVALID";
          }
          else if(data.checkTeamleaderIdPubg){
            this.disableButton = false;
            this.idPubgText = 'your id account in pubg';
            this.memberIdPubgText = 'team leader id account in pubg';
            this.memberIdPubgType = true;
            form.form.controls.teamLeaderIdpubg.status = "INVALID";
            form.form.status = "INVALID";
          }
          else if(!data.checkIdPubg && !data.checkTeamleaderIdPubg){
            this.squadBodyService.confirmMemberEmail(
              /*this.oldUserNameValue,*/
              this.oldGmailAccountValue ,
              form.form.value.Idpubg,
              form.form.value.teamLeaderIdpubg,
              this.videoId,
            );
          }
          else{
            this.dialog.open(ErrorComponent);
          }        
      })
    }
    else{
      this.register = false;
      this.upVideo = 'you click in Register button too much so the register stopped';
      target.scrollIntoView({behavior:"smooth"});
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
        this.errorServerUserNameType = false;
        this.userNameType = false;
        this.oldUserNameValue = filteUserName;
        clearTimeout(this.timeOutUserfullName);
        let $this = this;
        this.timeOutUserfullName = setTimeout(function () {
          userName.control.touched = true;
          $this.checkUserfullName =   $this.squadBodyService.checkMemberUserName($this.oldUserNameValue).subscribe((userNameType)=>{
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
          $this.checkGmailAccount =  $this.squadBodyService.checkMemberGmailAccount($this.oldGmailAccountValue).subscribe((gmailAccountType)=>{
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
    if(idPubg.value != this.oldIdPubgValue && this.oldIdPubgValue != null)
    {
      this.idPubgType = false;
      this.errorServerIdPubgType = false;
      this.memberRegisterExistsBefore = false;
    }
  }

  onKeyUpMemberIdPubg(memberIdPubg: any){
    if(memberIdPubg.value != this.oldMemberIdPubgValue && this.oldMemberIdPubgValue != null)
    {
      this.memberIdPubgType = false;
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
    if(this.getEmail)
    {
      this.getEmail.unsubscribe();
    }
  }
}
