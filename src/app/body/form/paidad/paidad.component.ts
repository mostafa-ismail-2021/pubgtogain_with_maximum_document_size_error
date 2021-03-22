import { Component, OnInit, OnDestroy,NgZone } from '@angular/core';
import { NgForm, Validators, FormControl} from '@angular/forms';
import {BodyService} from '../../body.service';
import { Subscription, from } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {ErrorComponent} from '../../../error/error.component';
import {
  OnPageVisibilityChange,
  AngularPageVisibilityStateEnum} from 'angular-page-visibility';

@Component({
  selector: 'app-paidad',
  templateUrl: './paidad.component.html',
  styleUrls: ['./paidad.component.css']
})
export class PaidadComponent implements OnInit  {

  constructor(private getRandom:BodyService , private dialog:MatDialog,private ngZone: NgZone) { }
  public YT: any;
  public video: any;
  public player: any;
  public reframed: boolean = false;
  public videoFinish :boolean = false;
  countUser:number;
  selectedVideo:string;
  private formSub:Subscription;
  
  ngOnInit(): void {
    /*this.formSub = this.getRandom.getVideoIdAndNumberOfUser().subscribe(a =>{
      this.countUser = a.countUser;
      this.init();
      this.video = a.videoId //video id

      window['onYouTubeIframeAPIReady'] = (e) => {
        this.YT = window['YT'];
        this.reframed = false;
        this.player = new window['YT'].Player('player', {
          videoId: this.video,
          playerVars: { 
            'autoplay': 1,
            'controls': 1,
            'rel' : 0,
            'fs' : 0,
        },
          events: {
            'onStateChange': this.onPlayerStateChange.bind(this),
            'onError': this.onPlayerError.bind(this),
          }
        });
      };
    },error => {this.dialog.open(ErrorComponent)})
    
*/
  }
  /*init() {
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }
  //
 
 
  @OnPageVisibilityChange()
  logWhenPageVisibilityChange ( visibilityState: AngularPageVisibilityStateEnum ): void {
    if ( AngularPageVisibilityStateEnum[visibilityState]
      === AngularPageVisibilityStateEnum[AngularPageVisibilityStateEnum.VISIBLE]) {
      this.player.playVideo();
    } else if (AngularPageVisibilityStateEnum[visibilityState]
      === AngularPageVisibilityStateEnum[AngularPageVisibilityStateEnum.HIDDEN]) {
      this.player.pauseVideo();
    }
  }
  ngOnDestroy():void{
    this.formSub.unsubscribe();
  }
  
  addPerson(form:NgForm)
  {
    this.getRandom.confirmEmail(
      form.value.userName,
      form.value.Email ,
      form.value.Idpubg,
      );
  }
  onPlayerStateChange(event) {
    this.ngZone.run(() => {
    switch (event.data) {
      
      case window['YT'].PlayerState.ENDED:
        this.videoFinish = true;
      break;
    };
  });
  };
  //utility
 
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
    
  };*/
}