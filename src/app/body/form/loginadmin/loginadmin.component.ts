import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import {authService} from '../../auth.service';
import {Router} from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loginadmin',
  templateUrl: './loginadmin.component.html',
  styleUrls: ['./loginadmin.component.css']
})
export class LoginadminComponent implements OnInit ,OnDestroy {

  constructor(private authService:authService , private route:Router) { }
  clickTimer:number = 0;
  spinnerLogIn:boolean = false;
  detailsToken:string = null;
  private logInSub:Subscription;
  ngOnInit(): void {
  }
  login(form:NgForm)
  {
    this.clickTimer++;
    this.spinnerLogIn = true;
    if(form.invalid)
    {
      return;
    }
    let _this = this;
    let email = form.value.Email;
    let password = form.value.password;
    setTimeout(function () {
      _this.authService.login(email , password)
      .subscribe((data:boolean) =>{
        if(data)
        {
          _this.route.navigate(['/admincontrol']);
        }
        else{
          _this.spinnerLogIn = false;
          _this.detailsToken = "email or password not vaild";
        }
      });
    },10000);
  }
  ngOnDestroy(){
    if(this.logInSub){
      this.logInSub.unsubscribe();
    }
  }
}