import { Component, OnInit, OnDestroy,NgZone } from '@angular/core';
import {BodyService} from '../../body.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {ErrorComponent} from '../../../error/error.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  OnPageVisibilityChange,
  AngularPageVisibilityStateEnum} from 'angular-page-visibility';

@Component({
  selector: 'app-freead',
  templateUrl: './freead.component.html',
  styleUrls: ['./freead.component.css']
})
export class FreeadComponent implements OnInit ,OnDestroy {

  constructor(private bodyService:BodyService , private dialog:MatDialog,private ngZone: NgZone,private dom:DomSanitizer) { }
  public YT: any;
  public player: any;
  public reframed: boolean = false;
  public videoFinish :boolean = false;
  public register:boolean = false;
  public upVideo:string;
  /*public userNameType:boolean = false;
  public userNameText:string='User full Name';
  public userNameDisable:boolean = false;
  public errorServerUserNameType:boolean = false;
  private oldUserNameValue:string = null;
  private checkUserfullName:Subscription;
  private timeOutUserfullName: any = null;*/
  public gmailAccountType:boolean = false;
  public youtubeType:boolean = false;
  public selectcountry:boolean = true;
  public selectedValue:string = 'EG';
  public gmailText:string='gmail account';
  public gmailAccountDisable:boolean = false;
  public errorServerGmailAccountType:boolean = false;
  public youtubeText:string='your youtube video id to display as ad';
  public youtubeDisable:boolean = false;
  public errorServerYoutubeType:boolean = false;
  public displayAdsWillAppear:Array<SafeResourceUrl> = [];
  public getDataOnServer:boolean = true;
  private videoType:string;
  private videoId:string;
  private adAppearanceCountry:string;
  private oldGmailAccountValue:string = null;
  private oldYoutubeValue:string = null;
  private getIp:Subscription;
  private checkVideoIdAndRegisterType:Subscription;
  private checkGmailAccount:Subscription;
  private checkYoutube:Subscription;
  private timeOutGmailAccount: any = null;
  private timeOutYoutube: any = null;
  private videoReady:boolean = false;
  private playercount:number = 0;

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getIp = this.bodyService.getIpAddress().subscribe((ipData:{ip})=>{
      this.bodyService.ipAddress = ipData.ip;
      this.checkVideoIdAndRegisterType = this.bodyService.getVideoIdAndFreeAdType().subscribe((data:{freeAdResgister:boolean , videoId:string , videoType:string , adAppearanceCountry:string,adsWillAppear:Array<string>}) =>{
        let _this = this;
        setTimeout(function () {
          _this.getDataOnServer = false;
          _this.addVideo(data.adsWillAppear.length);
        },3000);
        if(data.adsWillAppear.length == 0){
          this.register = data.freeAdResgister;
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
        }
        else{
          for (let index = 0; index < data.adsWillAppear.length; index++) {
            this.displayAdsWillAppear.push(this.dom.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+data.adsWillAppear[index]))
          }
        }
      },error => {this.dialog.open(ErrorComponent)})
    },error => {this.dialog.open(ErrorComponent)})
  }
  addVideo(length:number) {
    let $this = this;
    this.playercount++;
    setTimeout(function () {
      if(length == 0 && (document.getElementById('solofreeplayer') != null || $this.playercount > 60))
      {
        try{
          $this.init();
          if(window['onYouTubeIframeAPIReady'] == undefined)
          {
            window['onYouTubeIframeAPIReady'] = (e) => {
              $this.YT = window['YT'];
              $this.reframed = false;
              $this.player = new window['YT'].Player('solofreeplayer', {
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
            $this.player = new window['YT'].Player('solofreeplayer', {
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
      else if(length == 0){
        $this.addVideo(length);
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
      === AngularPageVisibilityStateEnum[AngularPageVisibilityStateEnum.VISIBLE] && this.videoReady && !this.videoFinish && this.displayAdsWillAppear.length == 0) {
      this.player.playVideo();
    } else if (AngularPageVisibilityStateEnum[visibilityState]
      === AngularPageVisibilityStateEnum[AngularPageVisibilityStateEnum.HIDDEN] && this.videoReady && !this.videoFinish && this.displayAdsWillAppear.length == 0) {
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

  addFreeAd()
  {
    if(this.selectcountry){
      this.selectedValue = "ALL";
    }
    this.bodyService.getEmailFreeAd(
      //this.oldUserNameValue,
      this.oldGmailAccountValue,
      this.oldYoutubeValue,
      this.selectedValue,
      this.videoId
      );
  }

  onPlayerStateChange(event) {
    this.ngZone.run(() => {
    switch (event.data) {
      /*case window['YT'].PlayerState.PLAYING:
        if (this.cleanTime() == 0) {
          console.log('started ' + this.cleanTime());
        } else {
          console.log('playing ' + this.cleanTime())
        };
        break;
      case window['YT'].PlayerState.PAUSED:
        this.videoFinish = true;
        alert(this.videoFinish = true)
        if (this.player.getDuration() - this.player.getCurrentTime() != 0) {
          console.log('paused' + ' @ ' + this.cleanTime());
        };
        break;
        */
      case window['YT'].PlayerState.ENDED:
        this.videoFinish = true;
        if(this.register == true)
        {
          this.upVideo = "Thanks for waiting for the video to finish";
        }
        if(this.videoType != "noType"){
          this.bodyService.increaseVideoFinish(this.videoId , this.videoType,this.adAppearanceCountry);
        }
      break;
    };
  });
  };
  //utility
  /*cleanTime() {
    return Math.round(this.player.getCurrentTime())
  };*/
  onPlayerError(event) {
    switch (event.data) {
      case 2:
        //console.log('' + this.video)
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
        this.userNameText = 'Please wait after completing your name';
        this.userNameType = false;
        this.errorServerUserNameType = false;
        this.userNameDisable = false;
        this.oldUserNameValue = filteUserName;
        clearTimeout(this.timeOutUserfullName);
        let $this = this;
        this.timeOutUserfullName = setTimeout(function () {
          userName.control.touched = true;
          $this.checkUserfullName =   $this.bodyService.checkUserNameFreeAd($this.oldUserNameValue).subscribe((userNameType)=>{
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
  }
  */
  onKeyUpGmailAccount(gmailAccount: any){
    let filteGmailAccont = gmailAccount.value.toLowerCase().split('.').join('').replace('@gmailcom','@gmail.com');
    if(gmailAccount.valid){
      if(this.oldGmailAccountValue != filteGmailAccont)
      {
        this.gmailText = 'Please wait after completing your gmail account';
        this.gmailAccountType = false;
        this.errorServerGmailAccountType = false;
        this.gmailAccountDisable = false;
        this.oldGmailAccountValue = filteGmailAccont;
        clearTimeout(this.timeOutGmailAccount);
        let $this = this;
        this.timeOutGmailAccount = setTimeout(function () {
          gmailAccount.control.touched = true;
          $this.checkGmailAccount =  $this.bodyService.checkGmailAccountFreeAd($this.oldGmailAccountValue).subscribe((gmailAccountType)=>{
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

  onKeyUpYoutube(youtube: any){
    let filteYoutube = youtube.value.split("/").pop();
    if(youtube.valid){
      if(this.oldYoutubeValue != filteYoutube)
      {
        this.youtubeText = 'Please wait after completing your youtube video id';
        this.youtubeType = false;
        this.errorServerYoutubeType = false;
        this.youtubeDisable = false;
        this.oldYoutubeValue = filteYoutube;
        clearTimeout(this.timeOutYoutube);
        let $this = this;
        this.timeOutYoutube = setTimeout(function () {
          youtube.control.touched = true;
          $this.checkYoutube =  $this.bodyService.checkYoutubeFreeAd($this.oldYoutubeValue).subscribe((youtubeType)=>{
            if($this.oldYoutubeValue == youtubeType.oldYoutube && $this.youtubeText == 'Please wait after completing your youtube video id')
            {
              $this.youtubeText = 'your youtube video id to display as ad';
              $this.youtubeType = youtubeType.acceptData;
              $this.youtubeDisable = youtubeType.acceptData;
              $this.errorServerYoutubeType = youtubeType.error;
              if(youtubeType.acceptData == false || youtubeType.error == true){
                youtube.control.status = "INVALID";
              }
            }
          },error=>{console.log("error")})
        }, 3000);
      }
    }
    else{
      if(this.oldYoutubeValue != filteYoutube)
      {
        clearTimeout(this.timeOutYoutube);
        this.oldYoutubeValue = filteYoutube;
        this.youtubeText = 'your youtube video id to display as ad';
        this.errorServerYoutubeType = false;
        this.youtubeType = true;
        this.youtubeDisable = false;
      }
    }
  }

  /*
  onKeyUpYoutube(youtube: any){
    if(youtube.valid){
      this.youtubeType = false;
      this.oldYoutubeValue = youtube.value;
      clearTimeout(this.timeOutYoutube);
      let $this = this;
      this.timeOutYoutube = setTimeout(function () {
        youtube.control.touched = true;
        let splitYoutube = youtube.value.split("/");console.log(youtube.value.split("/").pop())
        $this.checkYoutube =   $this.bodyService.checkYoutubeFreeAd(splitYoutube[splitYoutube.length-1]).subscribe((youtubeType:boolean)=>{
          $this.youtubeType = youtubeType;
          if(youtubeType == false){
            youtube.control.status = "INVALID";
          }
        },error=>{console.log("error")})
      }, 1000);
    }
    else{
      if(this.oldYoutubeValue != youtube.value)
      {
        this.youtubeType = true;
      }
    }
  }
  */

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
    if(this.checkYoutube)
    {
      this.checkYoutube.unsubscribe();
    }
  }
}

