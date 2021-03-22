import { Component, OnInit, OnDestroy} from '@angular/core';
import { NgForm } from '@angular/forms';
import {SquadbodyService} from '../../squadbody.service';
import {Subscription} from 'rxjs'
import { MatDialog } from '@angular/material/dialog';
import {ErrorComponent} from '../../../error/error.component';

@Component({
  selector: 'app-squadmember',
  templateUrl: './squadmember.component.html',
  styleUrls: ['./squadmember.component.css']
})
export class SquadmemberComponent implements OnInit {

  finish:string = "click on confirm buttom to complete register";
  click:number = 0;
  confirmType:boolean=true;
  private sub:Subscription;
  
  constructor(private squadBodyService:SquadbodyService , private dialog:MatDialog) { }
  
  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.confirmType = this.squadBodyService.getMemberFormAddedAndRandom();
    if(this.confirmType == false){
      this.finish = "please register first";
    }
  }

  ngOnDestroy():void{
    if(this.sub){
      this.sub.unsubscribe();
    }
  }

  Confirm(mailForm:NgForm,target:HTMLElement){
    this.click++;
    target.scrollIntoView({behavior:"smooth"});
    if(this.click <= 6){
      if(this.squadBodyService.checkMemberRandom(parseInt(mailForm.value.confirmMail))){
        this.confirmType = false;
        this.finish = 'Please wait';
        this.sub = this.squadBodyService.sendMemberData(parseInt(mailForm.value.confirmMail))
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
      this.squadBodyService.deleteMemberRandom();
    }
  }
}
