import { Component, OnInit } from '@angular/core';
import {authService} from './body/auth.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService:authService){}
  ngOnInit(){
    this.authService.autoAuthUser();
  }
  //title = 'championship-battle-ground';
}
