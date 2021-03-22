import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {duoAdmin} from './duoAdmin.service';
import {ErrorComponent} from '../../error/error.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-adminduopubg',
  templateUrl: './adminduopubg.component.html',
  styleUrls: ['./adminduopubg.component.css']
})
export class AdminduopubgComponent implements OnInit {

  constructor(private duoAdmin:duoAdmin , private dialog:MatDialog) { }

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
  PubgIdsGroup:Array<{pubgIdTeamLeader:string , pubgIdMember:string}> = [];
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
  private pubgIdsArray:Array<{pubgIdTeamLeader:string , pubgIdMember:string}> = [];
  private getPubgIdsArray:Array<{pubgIdTeamLeader:string , pubgIdMember:string}> = [];
  ngOnInit(): void {

  }

  addChampion(championData:NgForm){
    if(championData.valid){
      this.duoAdmin.addChampion(championData.value.startDate,championData.value.totalPlayer)
      .subscribe((data:{message:string})=>{
        this.messageAddChampion = data.message;
      });
    }
  }

  endChampion(championData:NgForm){
    if(championData.valid){
      this.duoAdmin.endChampion(championData.value.endDate).subscribe((data:{message:string})=>{
        this.messageEndChampion = data.message;
      });
    }
  }

  addCharityAd(addCharityAdForm:NgForm){
    let videoId = addCharityAdForm.value.videoId.split("/").pop();
    this.charityAds.push({
      videoId:videoId
      ,adAppearanceCountry:addCharityAdForm.value.adCountry
    });
  }

  deleteCharityAd(){
    this.charityAds.pop();
  }

  addCharityAdsToServer(){
    if(this.charityAds.length == 0)
    {
      alert("add value first to charity ads array");
    }
    else{
      this.duoAdmin.addCharityAdsToServer(this.charityAds).subscribe((data:{message:string})=>{
        this.messageAddCharityAds = data.message;
      });
    }
  }

  getCharityAds(){
    let adsData:Array<object> = null;
    this.duoAdmin.getCharityAds()
    .subscribe((data:Array<object>)=>{
      adsData = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      this.numberCharityAds = adsData.length;
      console.log(adsData);
    })
  }
  getCharityAdsServer(){
    let adsData:{ads:object} = null;
    let countAdsData:number = 0;
    this.duoAdmin.getCharityAdsServer()
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
    })
  }
  deleteCharityAds(){
    this.duoAdmin.deleteCharityAds().subscribe((data:{message:string})=>{
      this.messageDeleteCharityAds = data.message;
    });
  }
  charityAdsFromDatabaseToServer(){
    this.duoAdmin.charityAdsFromDatabaseToServer().subscribe((data:{message:string})=>{
      this.messageAddCharityAdsToServer = data.message;
    });
  }

  addOnePaidAd(addPaidAdForm:NgForm){
    this.paidAds.push(addPaidAdForm.value.id)
  }

  deleteOnePaidAd(){
    this.paidAds.pop();
  }

  addPaidAdsToServer(){
    if(this.paidAds.length == 0)
    {
      alert("add value first to paid ads array");
    }
    else{
      this.duoAdmin.addPaidAdsToServer(this.paidAds).subscribe((data:{message:string})=>{
        this.messageAddPaidAds = data.message;
      });
    }
  }

  addPaidAdToServer(addPaidAdForm:NgForm){
    this.duoAdmin.addPaidAdToServer(addPaidAdForm.value.id).subscribe((data:{message:string})=>{
      this.messageAddPaidAd = data.message;
    });
  }

  getAddPaidAds(){
    let getAds:Array<{_id:string}> = null;
    let addAds:Array<string> = [];
    this.duoAdmin.getPaidAds()
    .subscribe((data:Array<{_id:string}>)=>{
      getAds = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      if(getAds.length != 0){
        for (let index = 0; index < getAds.length; index++) {
          const element = getAds[index];
          addAds.push(element._id);
        }
        this.duoAdmin.addPaidAdsToServer(addAds)
        .subscribe((data:{message:string})=>{
          this.messageGetAddPaidAds = data.message;
        })
      }
      else{
        this.dialog.open(ErrorComponent)
      }
    }
    );
  }

  getPaidAds(){
    let paidAds:Array<{_id:string}> = null;
    this.duoAdmin.getPaidAds()
    .subscribe((data:Array<{_id:string}>)=>{
      paidAds = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      this.numberPaidAdsNotComplete = paidAds.length;
      console.log(paidAds);
    })
  }

  getDuoPaidAds(){
    let duoPaidAds:Array<{_id:string}> = null;
    this.duoAdmin.getDuoPaidAds()
    .subscribe((data:Array<{_id:string}>)=>{
      duoPaidAds = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      this.numberPaidAds = duoPaidAds.length;
      console.log(duoPaidAds);
    })
  }

  deletePaidAds(){
    this.duoAdmin.deletePaidAds().subscribe((data:{message:string})=>{
      this.messageDeletePaidAds = data.message;
    });
  }

  deletePaidAd(deletePaidAdForm:NgForm){
    this.duoAdmin.deletePaidAd(deletePaidAdForm.value.id).subscribe((data:{message:string})=>{
      this.messageDeletePaidAd = data.message;
    });
  }

  addBlackList(addBlackListForm:NgForm){
    this.blackList.push({
      email:addBlackListForm.value.email
      ,pubgId:addBlackListForm.value.pubgId
    });
  }

  deleteBlackListArray(){
    this.blackList.pop();
  }

  addBlackListToServer(){
    if(this.blackList.length == 0)
    {
      alert("add value first to black list array");
    }
    else{
      this.duoAdmin.addBlackListToServer(this.blackList).subscribe((data:{message:string})=>{
        this.messageAddBlackList = data.message;
      });
    }
  }

  getBlackList(){
    let adsData:Array<object> = null;
    this.duoAdmin.getBlackList()
    .subscribe((data:Array<object>)=>{
      adsData = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      this.numberBlackList = adsData.length;
      console.log(adsData);
    })
  }

  deleteBlackList(){
    this.duoAdmin.deleteBlackList().subscribe((data:{message:string})=>{
      this.messageDeleteBlackList = data.message;
    });
  }

  getPagesStates(){
    this.duoAdmin.getDuoPagesStates().subscribe((data:{exist:boolean,error:boolean,
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
    });
  }
  registerTeamLeaderTrue(){
    this.duoAdmin.registerTeamLeaderTrue().subscribe((data:{message:string})=>{
      this.messageRegisterTeamLeaderTrue = data.message;
    });
  }
  registerMemberTrue(){
    this.duoAdmin.registerMemberTrue().subscribe((data:{message:string})=>{
      this.messageRegisterMemberTrue = data.message;
    });
  }
  setFreeAdsTypeTrue(){
    this.duoAdmin.setFreeAdsTypeTrue().subscribe((data:{message:string})=>{
      this.messageFreeAdsTypeTrue = data.message;
    });
  }
  setReportHackerTypeTrue(){
    this.duoAdmin.setReportHackerTypeTrue().subscribe((data:{message:string})=>{
      this.messageReportHackerTypeTrue = data.message;
    });
  }
  setAppearHackerAndWinnersTrue(){
    this.duoAdmin.setAppearHackerAndWinnersTrue().subscribe((data:{message:string})=>{
      this.messageAppearHackerAndWinnersTrue = data.message;
    });
  }
  setSplitPlayersTypeTrue(){
    this.duoAdmin.setSplitPlayersTypeTrue().subscribe((data:{message:string})=>{
      this.messageSplitPlayersTypeTrue = data.message;
    });
  }
  registerTeamLeaderFalse(){
    this.duoAdmin.registerTeamLeaderFalse().subscribe((data:{message:string})=>{
      this.messageRegisterTeamLeaderFalse = data.message;
    });
  }
  registerMemberFalse(){
    this.duoAdmin.registerMemberFalse().subscribe((data:{message:string})=>{
      this.messageRegisterMemberFalse = data.message;
    });
  }
  setFreeAdsTypeFalse(){
    this.duoAdmin.setFreeAdsTypeFalse().subscribe((data:{message:string})=>{
      this.messageFreeAdsTypeFalse = data.message;
    });
  }
  setReportHackerTypeFalse(){
    this.duoAdmin.setReportHackerTypeFalse().subscribe((data:{message:string})=>{
      this.messageReportHackerTypeFalse = data.message;
    });
  }
  setAppearHackerAndWinnersFalse(){
    this.duoAdmin.setAppearHackerAndWinnersFalse().subscribe((data:{message:string})=>{
      this.messageAppearHackerAndWinnersFalse = data.message;
    });
  }
  setSplitPlayersTypeFalse(){
    this.duoAdmin.setSplitPlayersTypeFalse().subscribe((data:{message:string})=>{
      this.messageSplitPlayersTypeFalse = data.message;
    });
  }
  getRegisterAds(){
    let adsData:Array<{videoId:string, email:string, adAppearanceCountry:string}> = null;
    this.duoAdmin.getRegisterAds()
    .subscribe((data:Array<{videoId:string, email:string, adAppearanceCountry:string}>)=>{
      adsData = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      for (let index = 0; index < adsData.length; index++) {
        adsData[index].videoId = "https://youtu.be/"+adsData[index].videoId;
      }
      this.numberRegisterFreeAds = adsData.length;
      console.log(adsData);
    })
  }
  addFreeAdToServer(addFreeAdForm:NgForm){
    let videoId = addFreeAdForm.value.videoId.split("/").pop();
    this.duoAdmin.addFreeAdToServer(videoId ,addFreeAdForm.value.email , addFreeAdForm.value.adCountry ).subscribe((data:{message:string})=>{
      this.messageAddFreeAd = data.message;
    });
  }
  addAdsWillAppear(freeAds:NgForm){
    let addAdsWillAppear:Array<object> = null;
    this.duoAdmin.getAdsWillAppear(freeAds.value.numberAds)
    .subscribe((data:Array<object>)=>{
      addAdsWillAppear = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      if(addAdsWillAppear.length != 0){
        this.duoAdmin.addAdsWillAppear(addAdsWillAppear)
        .subscribe((data:{message:string})=>{
          this.messageAddFreeAds = data.message;
        })
      }
      else{
        alert("no data in register free ads to added in ads will appear");
        this.messageAddFreeAds = "no free ads will appear added";
      }
    }
    );
  }
  getRealAdsWillAppear(){
    let adsData:Array<object> = null;
    this.duoAdmin.getRealAdsWillAppear()
    .subscribe((data:Array<object>)=>{
      adsData = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      this.numberFreeAdsWillAppear = adsData.length;
      console.log(adsData);
    })
  }
  getRealAdsWillAppearServer(){
    let adsData:{ads:object} = null;
    let countAdsData:number = 0;
    this.duoAdmin.getRealAdsWillAppearServer()
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
    })
  }
  deleteAdsWillAppear(){
    this.duoAdmin.deleteAdsWillAppear().subscribe((data:{message:string})=>{
      this.messageDeleteFreeAds = data.message;
    });
  }
  deleteFreeAd(deleteFreeAdForm:NgForm){
    this.duoAdmin.deleteFreeAd(deleteFreeAdForm.value.id).subscribe((data:{message:string})=>{
      this.messageDeleteFreeAd = data.message;
    });
  }
  adsFromDatabaseToServer(){
    this.duoAdmin.adsFromDatabaseToServer().subscribe((data:{message:string})=>{
      this.messageAddAdsToServer = data.message;
    });
  }

  addPlayer(addPlayerForm:NgForm){
    this.duoAdmin.addPlayer(addPlayerForm.value.pubgIdTeamLeader , addPlayerForm.value.pubgIdMember).subscribe((data:{message:string})=>{
      this.messageAddPlayer = data.message;
    });
  }
  deletePlayer(deletePlayerForm:NgForm){
    this.duoAdmin.deletePlayer(deletePlayerForm.value.pubgId).subscribe((data:{message:string})=>{
      this.messageDeletePlayer = data.message;
    });
  }
  getPlayersAndCountDays(getPlayersAndCountDaysForm:NgForm){
    this.getPubgIdsArray = [];
    this.duoAdmin.getIdsPubg().subscribe(data=>{
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
    })
  }

  autoSplitPlayers(splitPlayersAuto:NgForm){
    this.pubgIdsArray = [];
    this.duoAdmin.getIdsPubg().subscribe(data=>{
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
        this.duoAdmin.addSplitPlayer(1,data).subscribe((data:{message:string})=>{
          this.autoAddSplitPlayer = data.message;
        });
      }
      else{
        alert("no players in database");
      }
    });
  }
  addSplitPlayerIdPubg(idPubgForm:NgForm){
    this.PubgIdsGroup.push({pubgIdTeamLeader:idPubgForm.value.pubgIdTeamLeader ,pubgIdMember:idPubgForm.value.pubgIdMember });
  }
  deleteSplitPlayerIdPubg(){
    this.PubgIdsGroup.pop();
  }
  addSplitPlayerGroup(groupForm:NgForm){
    if(this.PubgIdsGroup.length == 0)
    {
      alert("add ids pubg to group first");
    }
    else{
      this.GroupsData.push({
        groupNumber:groupForm.value.groupNumber,
        groupPlayers:this.PubgIdsGroup,
        date:groupForm.value.date,
        time:parseInt(groupForm.value.time)
      });
      this.PubgIdsGroup = [];
    }
  }
  deleteSplitPlayerGroup(){
    this.GroupsData.pop();
  }
  manulSplitPlayers(roundForm:NgForm){
    this.duoAdmin.addSplitPlayer(parseInt(roundForm.value.round) , this.GroupsData).subscribe((data:{message:string})=>{
      this.manualAddSplitPlayer = data.message;
    });
  }
  getSplitPlayer(){
    let splitPlayersData:{round:number,data:Array<object>} = null;
    this.duoAdmin.getSplitPlayer()
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
    });
  }
  getSplitPlayerNoConnect(){
    let splitPlayersData:Array<object> = null;
    this.duoAdmin.getSplitPlayerNoConnect()
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
    });
  }
  deleteSplitPlayers(){
    this.duoAdmin.deleteSplitPlayers().subscribe((data:{message:string})=>{
      this.messageSplitPlayers = data.message;
    });
  }
  sPFromDatabaseToServer(){
    this.duoAdmin.sPFromDatabaseToServer().subscribe((data:{message:string})=>{
      this.messageAddSPToServer = data.message;
    });
  }
  getRegisterHackers(){
    let hackerRegisterData:Array<object> = null;
    this.duoAdmin.getRegisterHackers()
    .subscribe((data:Array<object>)=>{
      hackerRegisterData = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      this.numberRegisterHackers = hackerRegisterData.length;
      console.log(hackerRegisterData);
    })
  }
  getEmailHacker(hackerEmail:NgForm){
    this.duoAdmin.getEmailHacker(hackerEmail.value.hackerPubgId).subscribe((data:{message:string})=>{
      this.emailHacker = data.message;
    });
  }
  pushHacker(hackerData:NgForm){
    this.hackersData.push({hackerPubgId:hackerData.value.hackerPubgId , email:hackerData.value.hackerEmail})
  }
  popHacker(){
    this.hackersData.pop();
  }
  pushWinnerPubg(winnerPubgData:NgForm){
    this.winnerPubgIdData.push(winnerPubgData.value.winnerPubg)
  }
  popWinnerPubg(){
    this.winnerPubgIdData.pop();
  }
  addHackersAndWinners(HackersAndWinnersData:NgForm){
    if(this.hackersData.length != 0 && this.winnerPubgIdData.length != 0)
    {
      let data = {
        round:HackersAndWinnersData.value.round,
        realHacker:this.hackersData,
        winnersPubgId:this.winnerPubgIdData
      }
      this.duoAdmin.addHackersAndWinners(data).subscribe((data:{message:string})=>{
        this.messageHackersAndWinners = data.message;
      });
    }
    else{
      this.messageHackersAndWinners = "add value to hackers and winners array";
    }
  }
  getLastHackersWinnersRound(){
    let lastRoundData:{round:number,realHacker:Array<object>,winnersPubgId:Array<object>} = null;
    this.duoAdmin.getLastHackersWinnersRound()
    .subscribe((data:{round:number,realHacker:Array<object>,winnersPubgId:Array<object>})=>{
      lastRoundData = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      console.log(lastRoundData);
    });
  }
  getReportHackers(){
    let reportHackersData:Array<object> = null;
    this.duoAdmin.getReportHackers()
    .subscribe((data:Array<object>)=>{
      reportHackersData = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      this.numberHackers = reportHackersData.length;
      console.log(reportHackersData);
    });
  }
  getReportHackersNoConnect(){
    let reportHackersData:Array<string> = null;
    this.duoAdmin.getReportHackersNoConnect()
    .subscribe((data:Array<string>)=>{
      reportHackersData = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      this.numberHackersServer = reportHackersData.length;
      console.log(reportHackersData);
    });
  }
  getWinnersPubg(){
    let WinnersPubgData:Array<string> = null;
    this.duoAdmin.getWinnersPubg()
    .subscribe((data:Array<string>)=>{
      WinnersPubgData = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      this.numberWinnersPubg = WinnersPubgData.length;
      console.log(WinnersPubgData);
    });
  }
  getWinnersPubgNoConnect(){
    let WinnersPubgData:Array<string> = null;
    this.duoAdmin.getWinnersPubgNoConnect()
    .subscribe((data:Array<string>)=>{
      WinnersPubgData = data;
    },error=>this.dialog.open(ErrorComponent)
    ,()=>{
      this.numberWinnersPubgServer = WinnersPubgData.length;
      console.log(WinnersPubgData);
    });
  }
  deleteHackersAndWinners(){
    this.duoAdmin.deleteHackersAndWinners().subscribe((data:{message:string})=>{
      this.messageDeleteHackersAndWinners = data.message;
    });
  }
  hAWFromDatabaseToServer(){
    this.duoAdmin.hAWFromDatabaseToServer().subscribe((data:{message:string})=>{
      this.messageAddHAWToServer = data.message;
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
