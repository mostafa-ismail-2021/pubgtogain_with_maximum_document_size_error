import { Component, OnDestroy, OnInit } from '@angular/core';
import {BodyService} from '../body/body.service';
import {DuobodyService} from '../body/duobody.service';
import {SquadbodyService} from '../body/squadbody.service';
import { HttpClient } from '@angular/common/http';
import { Subscription, from } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit ,OnDestroy {

  constructor(private http:HttpClient , private bodyService:BodyService , private duoBodyService:DuobodyService , private squadBodyService:SquadbodyService) { }
  private getIp:Subscription;
  ngOnInit(): void {
    if(this.bodyService.ipAddress == null || this.duoBodyService.ipAddress == null || this.squadBodyService.ipAddress == null)
    {
      this.getIp = this.http.get("https://cors-anywhere.herokuapp.com/http://api.ipify.org/?format=json").subscribe((ipData:{ip})=>{
        this.bodyService.ipAddress = ipData.ip;
        this.duoBodyService.ipAddress = ipData.ip;
        this.squadBodyService.ipAddress = ipData.ip;
      },error => {console.log("error")})
    }
  }
  ngOnDestroy():void{
    if(this.getIp){
      this.getIp.unsubscribe();
    }
  }
}
