import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgModel} from '@angular/forms';
import {SquadbodyService} from '../../squadbody.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {ErrorComponent} from '../../../error/error.component';

@Component({
  selector: 'app-squadreportthehacker',
  templateUrl: './squadreportthehacker.component.html',
  styleUrls: ['./squadreportthehacker.component.css']
})
export class SquadreportthehackerComponent implements OnInit ,OnDestroy{
  constructor(private squadBodyService:SquadbodyService , private dialog:MatDialog) { }
  public register:boolean = false;
  public appearHackerAndWinners:boolean = false;
  public upVideo:string;
  public gmailAccountType:boolean = false;
  public googleDriveType:boolean = false;
  public gmailText:string='gmail account';
  public gmailAccountDisable:boolean = false;
  public errorServerGmailAccountType:boolean = false;
  public googleDriveText:string='your google drive video sharing link';
  public googleDriveDisable:boolean = false;
  public errorServerGoogleDriveType:boolean = false;
  public getDataOnServer:boolean = true;
  public message:string = 'Your status will appear here';
  public disbaleBottom:boolean = false;
  public pubgIdText:string='your id account in pubg';
  public numberClickShowDate:number = 0;
  private oldGmailAccountValue:string = null;
  private oldGoogleDriveValue:string = null;
  private checkRegisterType:Subscription;
  private checkGmailAccount:Subscription;
  private checkGoogleDrive:Subscription;
  private timeOutGmailAccount: any = null;
  private timeOutGoogleDrive: any = null;
  private showPlayerStateType:Subscription;

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.checkRegisterType = this.squadBodyService.getReportHackerType().subscribe((data:{reportHackerResgister : boolean,apperHackerAndWinners:boolean}) =>{
      let _this = this;
      setTimeout(function () {
        _this.getDataOnServer = false;
      },3000);
      this.register = data.reportHackerResgister;
      this.appearHackerAndWinners = data.apperHackerAndWinners;
      if(data.apperHackerAndWinners == true)
      {
        this.upVideo = "the hackers and the winners in last round";
      }
      else if(data.reportHackerResgister == true){
        this.upVideo = "Registration is open";
      }
      else{
        this.upVideo = "sorry the register finished";
      }
    },error => {this.dialog.open(ErrorComponent)})
  }

  addReportHacker()
  {
    this.squadBodyService.getEmailReportHacker(
      this.oldGmailAccountValue,
      this.oldGoogleDriveValue,
      );
  }
  
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
          $this.checkGmailAccount =  $this.squadBodyService.checkGmailAccountReportHacker($this.oldGmailAccountValue).subscribe((gmailAccountType)=>{
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

  onKeyUpGoogleDrive(googleDrive: any){
    let filtegoogleDrive = googleDrive.value;
    if(googleDrive.valid){
      if(this.oldGoogleDriveValue != filtegoogleDrive)
      {
        this.googleDriveText = 'Please wait after completing your google drive video sharing link';
        this.googleDriveType = false;
        this.errorServerGoogleDriveType = false;
        this.googleDriveDisable = false;
        this.oldGoogleDriveValue = filtegoogleDrive;
        clearTimeout(this.timeOutGoogleDrive);
        let $this = this;
        this.timeOutGoogleDrive = setTimeout(function () {
          googleDrive.control.touched = true;
          $this.checkGoogleDrive =  $this.squadBodyService.checkGoogleDriveReportHacker($this.oldGoogleDriveValue).subscribe((googleDriveType)=>{
            if($this.oldGoogleDriveValue == googleDriveType.oldGoogleDrive && $this.googleDriveText == 'Please wait after completing your google drive video sharing link')
            {
              $this.googleDriveText = 'your google drive video sharing link';
              $this.googleDriveType = googleDriveType.acceptData;
              $this.googleDriveDisable = googleDriveType.acceptData;
              $this.errorServerGoogleDriveType = googleDriveType.error;
              if(googleDriveType.acceptData == false || googleDriveType.error == true){
                googleDrive.control.status = "INVALID";
              }
            }
          },error=>{console.log("error")})
        }, 3000);
      }
    }
    else{
      if(this.oldGoogleDriveValue != filtegoogleDrive)
      {
        clearTimeout(this.timeOutGoogleDrive);
        this.oldGoogleDriveValue = filtegoogleDrive;
        this.googleDriveText = 'your google drive video sharing link';
        this.errorServerGoogleDriveType = false;
        this.googleDriveType = true;
        this.googleDriveDisable = false;
      }
    }
  }

  showPlayerState(idPubg:NgModel,target:HTMLElement){
    this.disbaleBottom = true;
    this.pubgIdText = 'Please wait after completing your pubg id';
    this.numberClickShowDate++;
    if(this.numberClickShowDate<=6)
    {
      this.showPlayerStateType =  this.squadBodyService.getPlayerState(idPubg.control.value).subscribe((message)=>{
        this.disbaleBottom = false;
        this.pubgIdText = 'your id account in pubg';
        this.message = message
        target.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
      });
    }
    else{
      this.message = "you click in show date buttom a lot of times refresh the page to click again";
      this.pubgIdText = 'your id account in pubg';
    }
  }


  ngOnDestroy():void{
    if(this.checkRegisterType){
      this.checkRegisterType.unsubscribe();
    }
    if(this.checkGmailAccount){
      this.checkGmailAccount.unsubscribe();
    }
    if(this.checkGoogleDrive)
    {
      this.checkGoogleDrive.unsubscribe();
    }
    if(this.showPlayerStateType){
      this.showPlayerStateType.unsubscribe();
    }
  }
}

