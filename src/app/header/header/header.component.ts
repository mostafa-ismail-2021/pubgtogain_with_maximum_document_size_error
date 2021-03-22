import { Component, OnInit ,OnDestroy} from '@angular/core';
import {authService} from '../../body/auth.service'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit ,OnDestroy{

  userIsAutheticated:boolean = false;
  private authListenerSub:Subscription;
  constructor(private authService:authService) { }

  ngOnInit(): void {
    this.userIsAutheticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService.getauthStatusListener()
    .subscribe(isAuthenticated=>{
      this.userIsAutheticated = isAuthenticated;
    })
  }
  logout(){
    this.authService.logout();
  }
  ngOnDestroy(){
    if(this.authListenerSub)
    {
      this.authListenerSub.unsubscribe();
    }
  }
}
