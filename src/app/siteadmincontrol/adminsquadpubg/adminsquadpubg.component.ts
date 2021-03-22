import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {squadAdmin} from './squadAdmin.service';
import {ErrorComponent} from '../../error/error.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-adminsquadpubg',
  templateUrl: './adminsquadpubg.component.html',
  styleUrls: ['./adminsquadpubg.component.css']
})
export class AdminsquadpubgComponent implements OnInit {

  constructor(private squadAdmin:squadAdmin , private dialog:MatDialog) { }

  message:string=null;
  registerTeamLeaderChampionshipType:boolean=null;
  registerMemberChampionshipType:boolean=null;
  registerFreeAdsType:boolean=null;
  registerReportHackerType:boolean=null;
  appearHackerAndWinnersPubg:boolean=null;
  splitPlayersType:boolean = null;
  messageRegisterTeamLeaderTrue:string=null;
  messageRegisterMemberTrue:string = null;
  messageFreeAdsTypeTrue:string=null;
  messageReportHackerTypeTrue:string=null;
  messageAppearHackerAndWinnersTrue:string=null;
  messageSplitPlayersTypeTrue:string=null;
  messageRegisterTeamLeaderFalse:string=null;
  messageRegisterMemberFalse:string=null;
  messageFreeAdsTypeFalse:string=null;
  messageReportHackerTypeFalse:string=null;
  messageAppearHackerAndWinnersFalse:string=null;
  messageSplitPlayersTypeFalse:string=null;
  messageAddFreeAds:string = null;
  numberFreeAdsWillAppear:number = null;
  numberFreeAdsWillAppearServer:number = null;
  messageDeleteFreeAds:string = null;
  messageGetFreeAdsToServer:string = null;
  messageAddAdsToServer:string = null;
  numberRegisterHackers:number = null;
  hackersData:Array<{hackerPubgId:string , email:string}> = [];
  winnerPubgIdData:Array<string> = [];
  messageHackersAndWinners:string = null;
  numberHackers:number = null;
  emailHacker:string = null;
  numberHackersServer:number = null;
  numberWinnersPubg:number = null;
  numberWinnersPubgServer:number = null;
  messageDeleteHackersAndWinners:string = null;
  messageAddHAWToServer:string = null;
  autoAddSplitPlayer:string = null;
  PubgIdsGroup:Array<{pubgIdTeamLeader:string , pubgIdFirstMember:string , pubgIdSecondMember:string , pubgIdThirdMember:string}> = [];
  GroupsData:Array<object> = [];
  manualAddSplitPlayer:string = null;
  numberDaysTheFirstRoundTake:number = null;
  messageSplitPlayers:string = null;
  messageAddSPToServer:string = null;
  numberSplitPlayer:number = null;
  numberSplitPlayerServer:number = null;
  messageAddPlayer:string = null;
  messageDeletePlayer:string = null;
  charityAds:Array<object> = [];
  messageAddCharityAds:string = null;
  numberCharityAds:number = null;
  numberCharityAdsServer:number = null;
  messageDeleteCharityAds:string = null;
  messageAddCharityAdsToServer:string = null;
  blackList:Array<object> = [];
  messageAddBlackList:string = null;
  numberBlackList:number = null;
  messageDeleteBlackList:string = null;
  paidAds:Array<string> = [];
  messageAddPaidAds:string = null;
  messageAddPaidAd:string = null;
  messageGetAddPaidAds:string = null;
  numberPaidAdsNotComplete:number = null;
  numberPaidAds:number = null;
  messageDeletePaidAds:string = null;
  messageDeletePaidAd:string = null;
  deleteCharityAdRadio:boolean = false;
  addCharityAdsServerRadio:boolean = false;
  deleteCharityAdsRadio:boolean = false;
  charityAdsFromDatabaseToServerRadio:boolean = false;
  messageAddChampion:string = null;
  messageEndChampion:string = null;
  deletePaidAdRadio:boolean = false;
  addPaidAdsServerRadio:boolean= false;
  getAddPaidAdsRadio:boolean = false;
  deletePaidAdsRadio:boolean = false;
  addBlackListToServerRadio:boolean = false;
  deleteBlackListRadio:boolean = false;
  registerTeamLeaderTrueRadio:boolean = false;
  registerMemberTrueRadio:boolean = false;
  setFreeAdsTypeTrueRadio:boolean = false;
  setReportHackerTypeTrueRadio:boolean = false;
  setAppearHackerAndWinnersTrueRadio:boolean = false;
  setSplitPlayersTypeTrueRadio:boolean = false;
  registerTeamLeaderFalseRadio:boolean = false;
  registerMemberFalseRadio:boolean = false;
  setFreeAdsTypeFalseRadio:boolean = false;
  setReportHackerTypeFalseRadio:boolean = false;
  setAppearHackerAndWinnersFalseRadio:boolean = false;
  setSplitPlayersTypeFalseRadio:boolean = false;
  addAdsWillAppearRadio:boolean = false;
  deleteAdsWillAppearRadio:boolean = false;
  adsFromDatabaseToServerRadio:boolean = false;
  manulSplitPlayersRadio:boolean = false;
  deleteSplitPlayerGroupRadio:boolean = false;
  deleteSplitPlayersRadio:boolean = false;
  popHackerRadio:boolean = false;
  popWinnerPubgRadio:boolean = false;
  addHackersAndWinnersRadio:boolean = false;
  deleteHackersAndWinnersRadio:boolean = false;
  hAWFromDatabaseToServerRadio:boolean = false;
  deleteSplitPlayerIdPubgRadio:boolean = false;
  sPFromDatabaseToServerRadio:boolean = false;
  numberRegisterFreeAds:number = null;
  messageAddFreeAd:string = null;
  messageDeleteFreeAd:string = null;
  stopButtons:boolean = false;
  private pubgIdsArray:Array<{pubgIdTeamLeader:string , pubgIdFirstMember:string , pubgIdSecondMember:string , pubgIdThirdMember:string}> = [];
  private getPubgIdsArray:Array<{pubgIdTeamLeader:string , pubgIdFirstMember:string , pubgIdSecondMember:string , pubgIdThirdMember:string}> = [];
  ngOnInit(): void {

  }

  addChampion(championData:NgForm){
    if(championData.valid){
      this.stopButtons = true;
      this.squadAdmin.addChampion(championData.value.startDate,championData.value.totalPlayer)
      .subscribe((data:{message:string})=>{
        this.messageAddChampion = data.message;
        this.stopButtons = false;
      });
    }
  }

  endChampion(championData:NgForm){
    if(championData.valid){
      this.stopButtons = true;
      this.squadAdmin.endChampion(championData.value.endDate).subscribe((data:{message:string})=>{
        this.messageEndChampion = data.message;
        this.stopButtons = false;
      });
    }
  }

  addCharityAd(addCharityAdForm:NgForm){
    this.stopButtons = true;
    let videoId = addCharityAdForm.value.videoId.split("/").pop();
    this.charityAds.push({
      videoId:videoId
      ,adAppearanceCountry:addCharityAdForm.value.adCountry
    });
    this.stopButtons = false;
  }

  deleteCharityAd(){
    this.stopButtons = true;
    this.charityAds.pop();
    this.stopButtons = false;
  }

  addCharityAdsToServer(){
    if(this.charityAds.length == 0)
    {
      alert("add value first to charity ads array");
    }
    else{
      this.stopButtons = true;
      this.squadAdmin.addCharityAdsToServer(this.charityAds).subscribe((data:{message:string})=>{
        this.messageAddCharityAds = data.message;
        this.stopButtons = false;
      });
    }
  }

  getCharityAds(){
    this.stopButtons = true;
    let adsData:Array<object> = null;
    this.squadAdmin.getCharityAds()
    .subscribe((data:Array<object>)=>{
      adsData = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      this.numberCharityAds = adsData.length;
      console.log(adsData);
      this.stopButtons = false;
    })
  }
  getCharityAdsServer(){
    this.stopButtons = true;
    let adsData:{ads:object} = null;
    let countAdsData:number = 0;
    this.squadAdmin.getCharityAdsServer()
    .subscribe((data:{ads:object})=>{
      adsData = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      Object.keys(adsData).forEach(key => {
        let value = adsData[key];
        for (let index = 0; index < value.length; index++) {
          countAdsData++;
        }
      });
      this.numberCharityAdsServer = countAdsData;
      console.log(adsData);
      this.stopButtons = false;
    })
  }
  deleteCharityAds(){
    this.stopButtons = true;
    this.squadAdmin.deleteCharityAds().subscribe((data:{message:string})=>{
      this.messageDeleteCharityAds = data.message;
      this.stopButtons = false;
    });
  }
  charityAdsFromDatabaseToServer(){
    this.stopButtons = true;
    this.squadAdmin.charityAdsFromDatabaseToServer().subscribe((data:{message:string})=>{
      this.messageAddCharityAdsToServer = data.message;
      this.stopButtons = false;
    });
  }

  addOnePaidAd(addPaidAdForm:NgForm){
    this.stopButtons = true;
    this.paidAds.push(addPaidAdForm.value.id);
    this.stopButtons = false;
  }

  deleteOnePaidAd(){
    this.stopButtons = true;
    this.paidAds.pop();
    this.stopButtons = false;
  }

  addPaidAdsToServer(){
    if(this.paidAds.length == 0)
    {
      alert("add value first to paid ads array");
    }
    else{
      this.stopButtons = true;
      this.squadAdmin.addPaidAdsToServer(this.paidAds).subscribe((data:{message:string})=>{
        this.messageAddPaidAds = data.message;
        this.stopButtons = false;
      });
    }
  }

  addPaidAdToServer(addPaidAdForm:NgForm){
    this.stopButtons = true;
    this.squadAdmin.addPaidAdToServer(addPaidAdForm.value.id).subscribe((data:{message:string})=>{
      this.messageAddPaidAd = data.message;
      this.stopButtons = false;
    });
  }

  getAddPaidAds(){
    this.stopButtons = true;
    let getAds:Array<{_id:string}> = null;
    let addAds:Array<string> = [];
    this.squadAdmin.getPaidAds()
    .subscribe((data:Array<{_id:string}>)=>{
      getAds = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      if(getAds.length != 0){
        for (let index = 0; index < getAds.length; index++) {
          const element = getAds[index];
          addAds.push(element._id);
        }
        this.squadAdmin.addPaidAdsToServer(addAds)
        .subscribe((data:{message:string})=>{
          this.messageGetAddPaidAds = data.message;
        })
      }
      else{
        this.dialog.open(ErrorComponent)
      }
      this.stopButtons = false;
    }
    );
  }

  getPaidAds(){
    this.stopButtons = true;
    let paidAds:Array<{_id:string}> = null;
    this.squadAdmin.getPaidAds()
    .subscribe((data:Array<{_id:string}>)=>{
      paidAds = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      this.numberPaidAdsNotComplete = paidAds.length;
      console.log(paidAds);
      this.stopButtons = false;
    })
  }

  getSquadPaidAds(){
    this.stopButtons = true;
    let squadPaidAds:Array<{_id:string}> = null;
    this.squadAdmin.getSquadPaidAds()
    .subscribe((data:Array<{_id:string}>)=>{
      squadPaidAds = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      this.numberPaidAds = squadPaidAds.length;
      console.log(squadPaidAds);
      this.stopButtons = false;
    })
  }

  deletePaidAds(){
    this.stopButtons = true;
    this.squadAdmin.deletePaidAds().subscribe((data:{message:string})=>{
      this.messageDeletePaidAds = data.message;
      this.stopButtons = false;
    });
  }

  deletePaidAd(deletePaidAdForm:NgForm){
    this.stopButtons = true;
    this.squadAdmin.deletePaidAd(deletePaidAdForm.value.id).subscribe((data:{message:string})=>{
      this.messageDeletePaidAd = data.message;
      this.stopButtons = false;
    });
  }

  addBlackList(addBlackListForm:NgForm){
    this.stopButtons = true;
    this.blackList.push({
      email:addBlackListForm.value.email
      ,pubgId:addBlackListForm.value.pubgId
    });
    this.stopButtons = false;
  }

  deleteBlackListArray(){
    this.stopButtons = true;
    this.blackList.pop();
    this.stopButtons = false;
  }

  addBlackListToServer(){
    if(this.blackList.length == 0)
    {
      alert("add value first to black list array");
    }
    else{
      this.stopButtons = true;
      this.squadAdmin.addBlackListToServer(this.blackList).subscribe((data:{message:string})=>{
        this.messageAddBlackList = data.message;
        this.stopButtons = false;
      });
    }
  }

  getBlackList(){
    this.stopButtons = true;
    let adsData:Array<object> = null;
    this.squadAdmin.getBlackList()
    .subscribe((data:Array<object>)=>{
      adsData = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      this.numberBlackList = adsData.length;
      console.log(adsData);
      this.stopButtons = false;
    })
  }

  deleteBlackList(){
    this.stopButtons = true;
    this.squadAdmin.deleteBlackList().subscribe((data:{message:string})=>{
      this.messageDeleteBlackList = data.message;
      this.stopButtons = false;
    });
  }

  getPagesStates(){
    this.stopButtons = true;
    this.squadAdmin.getSquadPagesStates().subscribe((data:{exist:boolean,error:boolean,
      registerTeamLeaderChampionshipType:boolean,
      registerMemberChampionshipType:boolean,
      registerFreeAdsType:boolean,
      registerReportHackerType:boolean,
      appearHackerAndWinnersPubg:boolean,
      splitPlayersType:boolean}) =>{
        if(data.exist == false)
        {
          this.message = "no champion ship open";
        }
        else if(data.error == true)
        {
          this.message = "error occur in server";
        }
        else{
          this.message = "data get success";
        }
        this.registerTeamLeaderChampionshipType = data.registerTeamLeaderChampionshipType;
        this.registerMemberChampionshipType = data.registerMemberChampionshipType;
        this.registerFreeAdsType = data.registerFreeAdsType;
        this.registerReportHackerType = data.registerReportHackerType;
        this.appearHackerAndWinnersPubg = data.appearHackerAndWinnersPubg;
        this.splitPlayersType = data.splitPlayersType;
        this.stopButtons = false;
    });
  }
  registerTeamLeaderTrue(){
    this.stopButtons = true;
    this.squadAdmin.registerTeamLeaderTrue().subscribe((data:{message:string})=>{
      this.messageRegisterTeamLeaderTrue = data.message;
      this.stopButtons = false;
    });
  }
  registerMemberTrue(){
    this.stopButtons = true;
    this.squadAdmin.registerMemberTrue().subscribe((data:{message:string})=>{
      this.messageRegisterMemberTrue = data.message;
      this.stopButtons = false;
    });
  }
  setFreeAdsTypeTrue(){
    this.stopButtons = true;
    this.squadAdmin.setFreeAdsTypeTrue().subscribe((data:{message:string})=>{
      this.messageFreeAdsTypeTrue = data.message;
      this.stopButtons = false;
    });
  }
  setReportHackerTypeTrue(){
    this.stopButtons = true;
    this.squadAdmin.setReportHackerTypeTrue().subscribe((data:{message:string})=>{
      this.messageReportHackerTypeTrue = data.message;
      this.stopButtons = false;
    });
  }
  setAppearHackerAndWinnersTrue(){
    this.stopButtons = true;
    this.squadAdmin.setAppearHackerAndWinnersTrue().subscribe((data:{message:string})=>{
      this.messageAppearHackerAndWinnersTrue = data.message;
      this.stopButtons = false;
    });
  }
  setSplitPlayersTypeTrue(){
    this.stopButtons = true;
    this.squadAdmin.setSplitPlayersTypeTrue().subscribe((data:{message:string})=>{
      this.messageSplitPlayersTypeTrue = data.message;
      this.stopButtons = false;
    });
  }
  registerTeamLeaderFalse(){
    this.stopButtons = true;
    this.squadAdmin.registerTeamLeaderFalse().subscribe((data:{message:string})=>{
      this.messageRegisterTeamLeaderFalse = data.message;
      this.stopButtons = false;
    });
  }
  registerMemberFalse(){
    this.stopButtons = true;
    this.squadAdmin.registerMemberFalse().subscribe((data:{message:string})=>{
      this.messageRegisterMemberFalse = data.message;
      this.stopButtons = false;
    });
  }
  setFreeAdsTypeFalse(){
    this.stopButtons = true;
    this.squadAdmin.setFreeAdsTypeFalse().subscribe((data:{message:string})=>{
      this.messageFreeAdsTypeFalse = data.message;
      this.stopButtons = false;
    });
  }
  setReportHackerTypeFalse(){
    this.stopButtons = true;
    this.squadAdmin.setReportHackerTypeFalse().subscribe((data:{message:string})=>{
      this.messageReportHackerTypeFalse = data.message;
      this.stopButtons = false;
    });
  }
  setAppearHackerAndWinnersFalse(){
    this.stopButtons = true;
    this.squadAdmin.setAppearHackerAndWinnersFalse().subscribe((data:{message:string})=>{
      this.messageAppearHackerAndWinnersFalse = data.message;
      this.stopButtons = false;
    });
  }
  setSplitPlayersTypeFalse(){
    this.stopButtons = true;
    this.squadAdmin.setSplitPlayersTypeFalse().subscribe((data:{message:string})=>{
      this.messageSplitPlayersTypeFalse = data.message;
      this.stopButtons = false;
    });
  }
  getRegisterAds(){
    this.stopButtons = true;
    let adsData:Array<{videoId:string, email:string, adAppearanceCountry:string}> = null;
    this.squadAdmin.getRegisterAds()
    .subscribe((data:Array<{videoId:string, email:string, adAppearanceCountry:string}>)=>{
      adsData = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      for (let index = 0; index < adsData.length; index++) {
        adsData[index].videoId = "https://youtu.be/"+adsData[index].videoId;
      }
      this.numberRegisterFreeAds = adsData.length;
      console.log(adsData);
      this.stopButtons = false;
    })
  }
  addFreeAdToServer(addFreeAdForm:NgForm){
    this.stopButtons = true;
    let videoId = addFreeAdForm.value.videoId.split("/").pop();
    this.squadAdmin.addFreeAdToServer(videoId ,addFreeAdForm.value.email , addFreeAdForm.value.adCountry ).subscribe((data:{message:string})=>{
      this.messageAddFreeAd = data.message;
      this.stopButtons = false;
    });
  }
  addAdsWillAppear(freeAds:NgForm){
    this.stopButtons = true;
    let addAdsWillAppear:Array<object> = null;
    this.squadAdmin.getAdsWillAppear(freeAds.value.numberAds)
    .subscribe((data:Array<object>)=>{
      addAdsWillAppear = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      if(addAdsWillAppear.length != 0){
        this.squadAdmin.addAdsWillAppear(addAdsWillAppear)
        .subscribe((data:{message:string})=>{
          this.messageAddFreeAds = data.message;
        })
      }
      else{
        alert("no data in register free ads to added in ads will appear");
        this.messageAddFreeAds = "no free ads will appear added";
      }
      this.stopButtons = false;
    }
    );
  }
  getRealAdsWillAppear(){
    this.stopButtons = true;
    let adsData:Array<object> = null;
    this.squadAdmin.getRealAdsWillAppear()
    .subscribe((data:Array<object>)=>{
      adsData = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      this.numberFreeAdsWillAppear = adsData.length;
      console.log(adsData);
      this.stopButtons = false;
    })
  }
  getRealAdsWillAppearServer(){
    this.stopButtons = true;
    let adsData:{ads:object} = null;
    let countAdsData:number = 0;
    this.squadAdmin.getRealAdsWillAppearServer()
    .subscribe((data:{ads:object})=>{
      adsData = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      Object.keys(adsData).forEach(key => {
        let value = adsData[key];
        for (let index = 0; index < value.length; index++) {
          countAdsData++;
        }
      });
      this.numberFreeAdsWillAppearServer = countAdsData;
      console.log(adsData);
      this.stopButtons = false;
    })
  }
  deleteAdsWillAppear(){
    this.stopButtons = true;
    this.squadAdmin.deleteAdsWillAppear().subscribe((data:{message:string})=>{
      this.messageDeleteFreeAds = data.message;
      this.stopButtons = false;
    });
  }
  deleteFreeAd(deleteFreeAdForm:NgForm){
    this.stopButtons = true;
    this.squadAdmin.deleteFreeAd(deleteFreeAdForm.value.id).subscribe((data:{message:string})=>{
      this.messageDeleteFreeAd = data.message;
      this.stopButtons = false;
    });
  }
  adsFromDatabaseToServer(){
    this.stopButtons = true;
    this.squadAdmin.adsFromDatabaseToServer().subscribe((data:{message:string})=>{
      this.messageAddAdsToServer = data.message;
      this.stopButtons = false;
    });
  }

  addPlayer(addPlayerForm:NgForm){
    this.stopButtons = true;
    this.squadAdmin.addPlayer(
      addPlayerForm.value.pubgIdTeamLeader ,
      addPlayerForm.value.pubgIdFirstMember ,
      addPlayerForm.value.pubgIdSecondMember ,
      addPlayerForm.value.pubgIdThirdMember
    ).subscribe((data:{message:string})=>{
      this.messageAddPlayer = data.message;
      this.stopButtons = false;
    });
  }
  deletePlayer(deletePlayerForm:NgForm){
    this.stopButtons = true;
    this.squadAdmin.deletePlayer(deletePlayerForm.value.pubgId).subscribe((data:{message:string})=>{
      this.messageDeletePlayer = data.message;
      this.stopButtons = false;
    });
  }
  getPlayersAndCountDays(getPlayersAndCountDaysForm:NgForm){
    this.stopButtons = true;
    this.getPubgIdsArray = [];
    this.squadAdmin.getIdsPubg().subscribe(data=>{
      this.getPubgIdsArray = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      if(this.getPubgIdsArray.length != 0){
        let timeAllGroupsInDay:number = parseInt(getPlayersAndCountDaysForm.value.endTime) - parseInt(getPlayersAndCountDaysForm.value.startTime) + 1;
        let numberPlayersInDay:number = timeAllGroupsInDay * parseInt(getPlayersAndCountDaysForm.value.playersNumberInGroup);
        let numberDaysSameTimeOneGroup:number = Math.ceil(this.getPubgIdsArray.length/numberPlayersInDay);
        this.numberDaysTheFirstRoundTake = Math.ceil(numberDaysSameTimeOneGroup/parseInt(getPlayersAndCountDaysForm.value.maxSameTimeGroup));
        console.log(this.getPubgIdsArray);
      }
      else{
        alert("no players in database");
      }
      this.stopButtons = false;
    })
  }

  autoSplitPlayers(splitPlayersAuto:NgForm){
    this.stopButtons = true;
    this.pubgIdsArray = [];
    this.squadAdmin.getIdsPubg().subscribe(data=>{
      this.pubgIdsArray = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      if(this.pubgIdsArray.length != 0){
        this.pubgIdsArray = this.shuffle(this.pubgIdsArray);
        let i,j,temparray,chunk = parseInt(splitPlayersAuto.value.maxGroup);
        let data:Array<object> = [];
        let counterGroupNumber:number = 1;
        let counterMonthIndex:number = 0;
        let startDay:number=splitPlayersAuto.value.dayNumber;
        let startMonth:number = splitPlayersAuto.value.monthNumber;
        let startyear:number = splitPlayersAuto.value.yearNumber;
        let sliceMonths:Array<number>=splitPlayersAuto.value.sliceMonths.split(",");
        let startTime:number = parseInt(splitPlayersAuto.value.startTime);
        let timeOfNextGroup:number =parseInt(splitPlayersAuto.value.startTime);
        let endTime:number = parseInt(splitPlayersAuto.value.endTime);
        let maxSameTimeGroup = parseInt(splitPlayersAuto.value.maxSameTimeGroup);
        let countMaxSameTimeGroup = 1
        for (i=0,j=this.pubgIdsArray.length; i<j; i+=chunk) {
          temparray = this.pubgIdsArray.slice(i,i+chunk);
          if(timeOfNextGroup > endTime)
          {
            timeOfNextGroup = startTime;
            startDay++;
            if(startDay > sliceMonths[counterMonthIndex]){
              startDay = 1;
              startMonth++;
              counterMonthIndex++;
            }
            if(startMonth > 12){
              startyear++;
              startMonth = 1;
              startDay = 1;
            }
          }
          let date = startDay+"/"+startMonth+"/"+startyear;
          data.push({
            groupNumber:counterGroupNumber,
            groupPlayers:temparray,
            date:date,
            time:timeOfNextGroup
          });
          counterGroupNumber++;
          if(countMaxSameTimeGroup == maxSameTimeGroup){
            timeOfNextGroup++;
            countMaxSameTimeGroup = 1;
          }
          else{
            countMaxSameTimeGroup++;
          }
        }
        let subData = data.splice(0,50);
        this.squadAdmin.addSplitPlayer(1,subData).subscribe((messageData:{message:string})=>{
          this.autoAddSplitPlayer = messageData.message + 1;
          this.addSubSplitPlayer(data,1);
        });
      }
      else{
        alert("no players in database");
      }
    });
  }
  addSubSplitPlayer(data:Array<object> , number:number){
    if(data.length != 0){
      let _this = this;
      number++;
      setTimeout(function () {
        let subData = data.splice(0,50);
        _this.squadAdmin.addSubSplitPlayer(subData).subscribe((messageData:{message:string})=>{
          _this.autoAddSplitPlayer = _this.autoAddSplitPlayer + messageData.message + number;
          _this.addSubSplitPlayer(data,number);
        });
      },10000);
    }
    else{
      this.autoAddSplitPlayer = this.autoAddSplitPlayer + " => done";
      this.stopButtons = false;
    }
  }
  addSplitPlayerIdPubg(idPubgForm:NgForm){
    this.stopButtons = true;
    this.PubgIdsGroup.push({
      pubgIdTeamLeader:idPubgForm.value.pubgIdTeamLeader,
      pubgIdFirstMember:idPubgForm.value.pubgIdFirstMember,
      pubgIdSecondMember:idPubgForm.value.pubgIdSecondMember,
      pubgIdThirdMember:idPubgForm.value.pubgIdThirdMember
    });
    this.stopButtons = false;
  }
  deleteSplitPlayerIdPubg(){
    this.stopButtons = true;
    this.PubgIdsGroup.pop();
    this.stopButtons = false;
  }
  addSplitPlayerGroup(groupForm:NgForm){
    if(this.PubgIdsGroup.length == 0)
    {
      alert("add ids pubg to group first");
    }
    else{
      this.stopButtons = true;
      this.GroupsData.push({
        groupNumber:groupForm.value.groupNumber,
        groupPlayers:this.PubgIdsGroup,
        date:groupForm.value.date,
        time:parseInt(groupForm.value.time)
      });
      this.PubgIdsGroup = [];
      this.stopButtons = false;
    }
  }
  deleteSplitPlayerGroup(){
    this.stopButtons = true;
    this.GroupsData.pop();
    this.stopButtons = false;
  }
  manulSplitPlayers(roundForm:NgForm){
    this.stopButtons = true;
    this.squadAdmin.addSplitPlayer(parseInt(roundForm.value.round) , this.GroupsData).subscribe((data:{message:string})=>{
      this.manualAddSplitPlayer = data.message;
      this.stopButtons = false;
    });
  }
  getSplitPlayer(){
    this.stopButtons = true;
    let splitPlayersData:{round:number,data:Array<object>} = null;
    this.squadAdmin.getSplitPlayer()
    .subscribe((data:{round:number,data:Array<object>})=>{
      splitPlayersData = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      if(splitPlayersData.data.length != 0){
        this.numberSplitPlayer = splitPlayersData.data.length;
        console.log(splitPlayersData);
      }
      else{
        alert("no split players exist");
      }
      this.stopButtons = false;
    });
  }
  getSplitPlayerNoConnect(){
    this.stopButtons = true;
    let splitPlayersData:Array<object> = null;
    this.squadAdmin.getSplitPlayerNoConnect()
    .subscribe((data:Array<object>)=>{
      splitPlayersData = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      if(splitPlayersData.length != 0){
        this.numberSplitPlayerServer = splitPlayersData.length;
        console.log(splitPlayersData);
      }
      else{
        alert("no split players exist");
      }
      this.stopButtons = false;
    });
  }
  deleteSplitPlayers(){
    this.stopButtons = true;
    this.squadAdmin.deleteSplitPlayers().subscribe((data:{message:string})=>{
      this.messageSplitPlayers = data.message;
      this.stopButtons = false;
    });
  }
  sPFromDatabaseToServer(){
    this.stopButtons = true;
    this.squadAdmin.sPFromDatabaseToServer().subscribe((data:{message:string})=>{
      this.messageAddSPToServer = data.message;
      this.stopButtons = false;
    });
  }
  getRegisterHackers(){
    this.stopButtons = true;
    let hackerRegisterData:Array<object> = null;
    this.squadAdmin.getRegisterHackers()
    .subscribe((data:Array<object>)=>{
      hackerRegisterData = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      this.numberRegisterHackers = hackerRegisterData.length;
      console.log(hackerRegisterData);
      this.stopButtons = false;
    })
  }
  getEmailHacker(hackerEmail:NgForm){
    this.stopButtons = true;
    this.squadAdmin.getEmailHacker(hackerEmail.value.hackerPubgId).subscribe((data:{message:string})=>{
      this.emailHacker = data.message;
      this.stopButtons = false;
    });
  }
  pushHacker(hackerData:NgForm){
    this.stopButtons = true;
    this.hackersData.push({hackerPubgId:hackerData.value.hackerPubgId , email:hackerData.value.hackerEmail});
    this.stopButtons = false;
  }
  popHacker(){
    this.stopButtons = true;
    this.hackersData.pop();
    this.stopButtons = false;
  }
  pushWinnerPubg(winnerPubgData:NgForm){
    this.stopButtons = true;
    this.winnerPubgIdData.push(winnerPubgData.value.winnerPubg);
    this.stopButtons = false;
  }
  popWinnerPubg(){
    this.stopButtons = true;
    this.winnerPubgIdData.pop();
    this.stopButtons = false;
  }
  addHackersAndWinners(HackersAndWinnersData:NgForm){
    if(this.hackersData.length != 0 && this.winnerPubgIdData.length != 0)
    {
      /** */
      for (let index = 0; index < 50000; index++) {
        this.hackersData.push({hackerPubgId:"000000"+index , email:index+"@gmail.com"});
        this.winnerPubgIdData.push("111111"+index);
      }
      for (let index = 0; index < 10000; index++) {
        this.winnerPubgIdData.push("333333"+index);
      }
      /** */
      this.stopButtons = true;
      if(this.hackersData.length <= 2000 && this.winnerPubgIdData.length <= 2000)
      {
        let data = {
          round:HackersAndWinnersData.value.round,
          realHacker:this.hackersData,
          winnersPubgId:this.winnerPubgIdData
        }
        this.squadAdmin.addHackersAndWinners(data).subscribe((data:{message:string,indexHackerAndWinnersPubg:number})=>{
          this.messageHackersAndWinners = data.message;
          this.stopButtons = false;
        });
      }
      else{
        let hackersData = this.hackersData;
        let winnerPubgIdData = this.winnerPubgIdData;
        let subHackersData = hackersData.splice(0,5000);
        let subWinnersPubgId = winnerPubgIdData.splice(0,5000);
        let data = {
          round:HackersAndWinnersData.value.round,
          realHacker:subHackersData,
          winnersPubgId:subWinnersPubgId
        }
        this.squadAdmin.addHackersAndWinners(data).subscribe((data:{message:string,indexHackerAndWinnersPubg:number})=>{
          this.messageHackersAndWinners = data.message + 1;
          this.addSubHackersAndWinners(hackersData , winnerPubgIdData , data.indexHackerAndWinnersPubg , 1);
        });
      }
    }
    else{
      this.messageHackersAndWinners = "add value to hackers and winners array";
    }
  }
  addSubHackersAndWinners(hackersData:Array<{hackerPubgId:string , email:string}> , winnerPubgIdData:Array<string> , index:number , number:number){
    if(hackersData.length != 0 || winnerPubgIdData.length != 0){
      let _this = this;
      number++;
      setTimeout(function () {
        let subHackersData = hackersData.splice(0,5000);
        let subWinnersPubgId = winnerPubgIdData.splice(0,5000);console.log(subHackersData); console.log(subWinnersPubgId);
        _this.squadAdmin.addSubHackersAndWinners(subHackersData , subWinnersPubgId , index).subscribe((messageData:{message:string})=>{
          _this.messageHackersAndWinners = _this.messageHackersAndWinners + messageData.message + number;
          _this.addSubHackersAndWinners(hackersData ,winnerPubgIdData , index ,number);
        });
      },10000);
    }
    else{
      this.messageHackersAndWinners = this.messageHackersAndWinners + " => done";
      this.stopButtons = false;
    }
  }
  getLastHackersWinnersRound(){
    this.stopButtons = true;
    let lastRoundData:{round:number,realHacker:Array<object>,winnersPubgId:Array<object>} = null;
    this.squadAdmin.getLastHackersWinnersRound()
    .subscribe((data:{round:number,realHacker:Array<object>,winnersPubgId:Array<object>})=>{
      lastRoundData = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      console.log(lastRoundData);
      this.stopButtons = false;
    });
  }
  getReportHackers(){
    this.stopButtons = true;
    let reportHackersData:Array<object> = null;
    this.squadAdmin.getReportHackers()
    .subscribe((data:Array<object>)=>{
      reportHackersData = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      this.numberHackers = reportHackersData.length;
      console.log(reportHackersData);
      this.stopButtons = false;
    });
  }
  getReportHackersNoConnect(){
    this.stopButtons = true;
    let reportHackersData:Array<string> = null;
    this.squadAdmin.getReportHackersNoConnect()
    .subscribe((data:Array<string>)=>{
      reportHackersData = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      this.numberHackersServer = reportHackersData.length;
      console.log(reportHackersData);
      this.stopButtons = false;
    });
  }
  getWinnersPubg(){
    this.stopButtons = true;
    let WinnersPubgData:Array<string> = null;
    this.squadAdmin.getWinnersPubg()
    .subscribe((data:Array<string>)=>{
      WinnersPubgData = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      this.numberWinnersPubg = WinnersPubgData.length;
      console.log(WinnersPubgData);
      this.stopButtons = false;
    });
  }
  getWinnersPubgNoConnect(){
    this.stopButtons = true;
    let WinnersPubgData:Array<string> = null;
    this.squadAdmin.getWinnersPubgNoConnect()
    .subscribe((data:Array<string>)=>{
      WinnersPubgData = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      this.numberWinnersPubgServer = WinnersPubgData.length;
      console.log(WinnersPubgData);
      this.stopButtons = false;
    });
  }
  deleteHackersAndWinners(){
    this.stopButtons = true;
    this.squadAdmin.deleteHackersAndWinners().subscribe((data:{message:string})=>{
      this.messageDeleteHackersAndWinners = data.message;
      this.stopButtons = false;
    });
  }
  hAWFromDatabaseToServer(){
    this.stopButtons = true;
    this.squadAdmin.hAWFromDatabaseToServer().subscribe((data:{message:string})=>{
      this.messageAddHAWToServer = data.message;
      this.stopButtons = false;
    });
  }
  shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

}
