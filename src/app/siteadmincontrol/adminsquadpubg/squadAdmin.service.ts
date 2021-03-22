import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class squadAdmin {

    private url:string = "http://localhost:3000/";

    constructor(private http:HttpClient) { }
    addChampion(startDate:string,playerNumber:number){
        return this.http.post<{message:string}>(this.url + "api/squad/addChampion" , {startDate:startDate , totalPlayersNumber:playerNumber});
    }
    endChampion(endDate:string){
        return this.http.post<{message:string}>(this.url + "api/squad/endChampion" , {endDate:endDate});
    }
    addCharityAdsToServer(charityAds:Array<object>){
        return this.http.post<{message:string}>(this.url + "api/squad/addCharityAds" , {charityAds:charityAds});
    }
    getCharityAds(){
        return this.http.get<Array<object>>(this.url + "api/squad/getCharityAds")
    }
    getCharityAdsServer(){
        return this.http.get<{ads:object}>(this.url + "api/squad/getCharityAdsServer")
    }
    deleteCharityAds(){
        return this.http.get<{message:string}>(this.url + "api/squad/deleteCharityAds")
    }
    charityAdsFromDatabaseToServer(){
        return this.http.get<{message:string}>(this.url + "api/squad/CharityAdsFromDatabaseToServer")
    }
    addPaidAdsToServer(paidAds:Array<string>){
        return this.http.post<{message:string}>(this.url + "api/squad/addPaidAdsToServer" , {paidAds:paidAds});
    }
    addPaidAdToServer(paidAd:string){
        return this.http.post<{message:string}>(this.url + "api/squad/addPaidAdToServer" , {paidAd:paidAd});
    }
    getPaidAds(){
        return this.http.get<Array<{_id:string}>>(this.url + "api/squad/getPaidAds")
    }
    getSquadPaidAds(){
        return this.http.get<Array<{_id:string}>>(this.url + "api/squad/getSquadPaidAds")
    }
    deletePaidAds(){
        return this.http.get<{message:string}>(this.url + "api/squad/deletePaidAds")
    }
    deletePaidAd(deletePaidAd:string){
        return this.http.post<{message:string}>(this.url + "api/squad/deletePaidAd" , {deletePaidAd:deletePaidAd});
    }
    addBlackListToServer(blackList:Array<object>){
        return this.http.post<{message:string}>(this.url + "api/squad/addBlackList" , {blackList:blackList});
    }
    getBlackList(){
        return this.http.get<Array<object>>(this.url + "api/squad/getBlackList")
    }
    deleteBlackList(){
        return this.http.get<{message:string}>(this.url + "api/squad/deleteBlackList")
    }
    getSquadPagesStates(){
        return this.http.get<{exist:boolean,error:boolean,
                registerTeamLeaderChampionshipType:boolean,
                registerMemberChampionshipType:boolean,
                registerFreeAdsType:boolean,
                registerReportHackerType:boolean,
                appearHackerAndWinnersPubg:boolean,
                splitPlayersType:boolean}>(this.url+"api/squad/getPagesState");
    }
    registerTeamLeaderTrue(){
        return this.http.get<{message:string}>(this.url + "api/squad/registerTeamLeaderTrue");
    }
    registerMemberTrue(){
        return this.http.get<{message:string}>(this.url + "api/squad/registerMemberTrue");
    }
    setFreeAdsTypeTrue(){
        return this.http.get<{message:string}>(this.url + "api/squad/setFreeAdsTypeTrue");
    }
    setReportHackerTypeTrue(){
        return this.http.get<{message:string}>(this.url + "api/squad/setReportHackerTypeTrue");
    }
    setAppearHackerAndWinnersTrue(){
        return this.http.get<{message:string}>(this.url + "api/squad/setAppearHackerAndWinnersTrue");
    }
    setSplitPlayersTypeTrue(){
        return this.http.get<{message:string}>(this.url + "api/squad/setSplitPlayersTypeTrue");
    }
    registerTeamLeaderFalse(){
        return this.http.get<{message:string}>(this.url + "api/squad/registerTeamLeaderFalse");
    }
    registerMemberFalse(){
        return this.http.get<{message:string}>(this.url + "api/squad/registerMemberFalse");
    }
    setFreeAdsTypeFalse(){
        return this.http.get<{message:string}>(this.url + "api/squad/setFreeAdsTypeFalse");
    }
    setReportHackerTypeFalse(){
        return this.http.get<{message:string}>(this.url + "api/squad/setReportHackerTypeFalse");
    }
    setAppearHackerAndWinnersFalse(){
        return this.http.get<{message:string}>(this.url + "api/squad/setAppearHackerAndWinnersFalse");
    }
    setSplitPlayersTypeFalse(){
        return this.http.get<{message:string}>(this.url + "api/squad/setSplitPlayersTypeFalse");
    }
    getRegisterAds(){
        return this.http.get<Array<{videoId:string, email:string, adAppearanceCountry:string}>>(this.url + "api/squad/getRegisterAds")
    }
    addFreeAdToServer(videoId:string ,email:string ,adCountry:string){
        return this.http.post<{message:string}>(this.url + "api/squad/addFreeAdToServer" , {videoId:videoId ,email:email ,adCountry:adCountry});
    }
    getAdsWillAppear(numberAds:number){
        return this.http.get<Array<object>>(this.url + "api/squad/getAdsWillAppear?adsnumber="+numberAds)
    }
    addAdsWillAppear(ads:Array<object>){
        return this.http.post<{message:string}>(this.url + "api/squad/addAdsWillAppear",{ads:ads})
    }
    getRealAdsWillAppear(){
        return this.http.get<Array<object>>(this.url + "api/squad/getRealAdsWillAppear")
    }
    getRealAdsWillAppearServer(){
        return this.http.get<{ads:object}>(this.url + "api/squad/getAdsWillAppearserver")
    }
    deleteAdsWillAppear(){
        return this.http.get<{message:string}>(this.url + "api/squad/deleteAdsWillAppear")
    }
    deleteFreeAd(deleteFreeAd:string){
        return this.http.post<{message:string}>(this.url + "api/squad/deleteFreeAd" , {deleteFreeAd:deleteFreeAd});
    }
    adsFromDatabaseToServer(){
        return this.http.get<{message:string}>(this.url + "api/squad/adsFromDatabaseToServer")
    }

    addPlayer(pubgIdTeamLeader:string , pubgIdFirstMember:string , pubgIdSecondMember:string , pubgIdThirdMember:string){
        return this.http.post<{message:string}>(
            this.url + "api/squad/addPlayer",
            {
                pubgIdTeamLeader:pubgIdTeamLeader ,
                pubgIdFirstMember:pubgIdFirstMember , 
                pubgIdSecondMember : pubgIdSecondMember , 
                pubgIdThirdMember:pubgIdThirdMember
            }
        );
    }
    deletePlayer(pubgId:string){
        return this.http.get<{message:string}>(this.url + "api/squad/deletePlayer?pubgId="+pubgId)
    }
    getIdsPubg(){
        return this.http.get<Array<{pubgIdTeamLeader:string , pubgIdFirstMember:string , pubgIdSecondMember:string , pubgIdThirdMember:string}>>(this.url+"api/squad/getPubgIds");
    }
    addSplitPlayer(round:number , data:Array<object>){
        return this.http.post<{message:string}>(this.url + "api/squad/splitPlayer" , {round:round , data:data});
    }
    addSubSplitPlayer(data:Array<object>){
        return this.http.post<{message:string}>(this.url + "api/squad/addSubSplitPlayer" , {data:data});
    }
    getSplitPlayer(){
        return this.http.get<{round:number,data:Array<object>}>(this.url + "api/squad/getSplitPlayer");
    }
    getSplitPlayerNoConnect(){
        return this.http.get<Array<object>>(this.url + "api/squad/getSplitPlayerNoConnect");
    }
    deleteSplitPlayers(){
        return this.http.get<{message:string}>(this.url + "api/squad/deleteSplitPlayers");
    }
    sPFromDatabaseToServer(){
        return this.http.get<{message:string}>(this.url + "api/squad/sPFromDatabaseToServer");
    }
    getRegisterHackers(){
        return this.http.get<Array<object>>(this.url+"api/squad/getRegisterHackers");
    }
    getEmailHacker(idPubg:string){
        return this.http.post<{message:string}>(this.url + "api/squad/getEmailHacker" , {idPubg:idPubg});
    }
    addHackersAndWinners(data:object){
        return this.http.post<{message:string,indexHackerAndWinnersPubg:number}>(this.url + "api/squad/addHackersAndWinners" , {data:data});
    }
    addSubHackersAndWinners(hackersData:Array<{hackerPubgId:string , email:string}> , winnerPubgIdData:Array<string> , index:number){
        return this.http.post<{message:string}>(this.url + "api/squad/addSubHackersAndWinners" , {hackersData:hackersData , winnerPubgIdData:winnerPubgIdData , index:index});
    }
    getLastHackersWinnersRound(){
        return this.http.get<{round:number,realHacker:Array<object>,winnersPubgId:Array<object>}>(this.url + "api/squad/getLastHackersWinnersRound");
    }
    getReportHackers(){
        return this.http.get<Array<object>>(this.url+"api/squad/getReportHackers");
    }
    getReportHackersNoConnect(){
        return this.http.get<Array<string>>(this.url+"api/squad/getReportHackersNoConnect");
    }
    getWinnersPubg(){
        return this.http.get<Array<string>>(this.url+"api/squad/getWinnersPubg");
    }
    getWinnersPubgNoConnect(){
        return this.http.get<Array<string>>(this.url+"api/squad/getWinnersPubgNoConnect");
    }
    deleteHackersAndWinners(){
        return this.http.get<{message:string}>(this.url + "api/squad/deleteHackersAndWinners");
    }
    hAWFromDatabaseToServer(){
        return this.http.get<{message:string}>(this.url + "api/squad/hAWFromDatabaseToServer");
    }
}