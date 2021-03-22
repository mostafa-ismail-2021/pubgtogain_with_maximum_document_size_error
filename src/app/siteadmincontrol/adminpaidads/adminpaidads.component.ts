import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {adminpaidad} from './adminpaidad.service';
import { MatDialog } from '@angular/material/dialog';
import {ErrorComponent} from '../../error/error.component';
@Component({
  selector: 'app-adminpaidads',
  templateUrl: './adminpaidads.component.html',
  styleUrls: ['./adminpaidads.component.css']
})
export class AdminpaidadsComponent implements OnInit {

  constructor(private adminpaidad:adminpaidad , private dialog:MatDialog) { }
  messageAddPaidAd:string = null;
  numberPaidAds:number = null;
  numberPaidAdsNot:number = null;
  messageDeletePaidAds:string = null;
  numberPaidAdsCompany:number = null;

  ngOnInit(): void {
  }
  addPaidAdToServer(addPaidAdForm:NgForm){
    let videoId = addPaidAdForm.value.videoId.split("/").pop();
    let paidAdData ={
      videoId:videoId,
      totalViews:addPaidAdForm.value.totalViews,
      companyName:addPaidAdForm.value.companyName,
      costByEGP:addPaidAdForm.value.costByEGP,
      adAppearanceCountry:addPaidAdForm.value.adAppearanceCountry,
    }
    this.adminpaidad.addPaidAdToServer(paidAdData).subscribe((data:{message:string})=>{
      this.messageAddPaidAd = data.message;
    });
  }
  getPaidAds(){
    let paidAds:Array<object> = null;
    this.adminpaidad.getPaidAds()
    .subscribe((data:Array<object>)=>{
      paidAds = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      this.numberPaidAds = paidAds.length;
      console.log(paidAds);
    })
  }
  getPaidAdsNot(){
    let paidAdsNot:Array<object> = null;
    this.adminpaidad.getPaidAdsNot()
    .subscribe((data:Array<object>)=>{
      paidAdsNot = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      this.numberPaidAdsNot = paidAdsNot.length;
      console.log(paidAdsNot);
    })
  }
  getPaidAdsCompany(addPaidAdCompanyForm:NgForm){
    let paidAds:Array<object> = null;
    this.adminpaidad.getPaidAdsCompany(addPaidAdCompanyForm.value.companyName)
    .subscribe((data:Array<object>)=>{
      paidAds = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      this.numberPaidAdsCompany = paidAds.length;
      console.log(paidAds);
    })
  }
  deletePaidAd(deletePaidAdForm:NgForm){
    this.adminpaidad.deletePaidAd(deletePaidAdForm.value._id).subscribe((data:{message:string})=>{
      this.messageDeletePaidAds = data.message;
    });
  }
}
