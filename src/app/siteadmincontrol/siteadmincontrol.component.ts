import { Component, OnInit } from '@angular/core';
import{BodyService} from '../body/body.service'
@Component({
  selector: 'app-siteadmincontrol',
  templateUrl: './siteadmincontrol.component.html',
  styleUrls: ['./siteadmincontrol.component.css']
})
export class SiteadmincontrolComponent implements OnInit {

  constructor(private bodyService:BodyService) { }

  ngOnInit(): void {
  }
  addSolo(){
    this.bodyService.addSolo();
  }
  addDuo(){
    this.bodyService.addDuo();
  }
  addSquad(){
    this.bodyService.addSquad();
  }
  addhackerswinners(){
    this.bodyService.addhackerswinners();
  }
}
