import { Component, OnInit, OnDestroy} from '@angular/core';
import { NgForm } from '@angular/forms';
import {DuobodyService} from '../../duobody.service';
import {Subscription} from 'rxjs'
import { MatDialog } from '@angular/material/dialog';
import {ErrorComponent} from '../../../error/error.component';

@Component({
  selector: 'app-free-ad-duo-confirm-email',
  templateUrl: './free-ad-duo-confirm-email.component.html',
  styleUrls: ['./free-ad-duo-confirm-email.component.css']
})
export class FreeAdDuoConfirmEmailComponent implements OnInit ,OnDestroy{

  finish:string = "click on confirm buttom to complete register";
  click:number = 0;
  confirmType:boolean=true;
  private sub:Subscription;
  
  constructor(private duoBodyService:DuobodyService , private dialog:MatDialog) { }
  
  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.confirmType = this.duoBodyService.getFormAddedAndRandomFreeAd();
    if(this.confirmType == false){
      this.finish = "please register first";
    }
  }

  ngOnDestroy():void{
    if(this.sub){
      this.sub.unsubscribe();
    }
  }

  Confirm(mailForm:NgForm ,target:HTMLElement){
    this.click++;
    target.scrollIntoView({behavior:"smooth"});
    if(this.click <= 6){
      if(this.duoBodyService.checkRandomFreeAd(parseInt(mailForm.value.confirmMail))){
        this.confirmType = false;
        this.finish = 'Please wait';
        this.sub = this.duoBodyService.sendDataFreeAd(parseInt(mailForm.value.confirmMail))
          .subscribe((a)=>{this.finish = a.message;this.confirmType = false},error => {this.dialog.open(ErrorComponent)});
      }
      else{
        this.finish = "your email confirm not valid please confirm again";
      }
    }
    else{
      this.click = 0;
      this.finish = "you click many times on confirm button so your confirm deleted please register again";
      this.confirmType = false;
      this.duoBodyService.deleteRandomFreeAd();
    }
  }
}
