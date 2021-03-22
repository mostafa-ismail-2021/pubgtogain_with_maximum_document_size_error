import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class duoAdmin {

    private url:string = "http://localhost:3000/";

    constructor(private http:HttpClient) { }
    addChampion(startDate:string,playerNumber:number){
        return this.http.post<{message:string}>(this.url + "api/duo/addChampion" , {startDate:startDate , totalPlayersNumber:playerNumber});
    }
    endChampion(endDate:string){
        return this.http.post<{message:string}>(this.url + "api/duo/endChampion" , {endDate:endDate});
    }
    addCharityAdsToServer(charityAds:Array<object>){
        return this.http.post<{message:string}>(this.url + "api/duo/addCharityAds" , {charityAds:charityAds});
    }
    getCharityAds(){
        return this.http.get<Array<object>>(this.url + "api/duo/getCharityAds")
    }
    getCharityAdsServer(){
        return this.http.get<{ads:object}>(this.url + "api/duo/getCharityAdsServer")
    }
    deleteCharityAds(){
        return this.http.get<{message:string}>(this.url + "api/duo/deleteCharityAds")
    }
    charityAdsFromDatabaseToServer(){
        return this.http.get<{message:string}>(this.url + "api/duo/CharityAdsFromDatabaseToServer")
    }
    addPaidAdsToServer(paidAds:Array<string>){
        return this.http.post<{message:string}>(this.url + "api/duo/addPaidAdsToServer" , {paidAds:paidAds});
    }
    addPaidAdToServer(paidAd:string){
        return this.http.post<{message:string}>(this.url + "api/duo/addPaidAdToServer" , {paidAd:paidAd});
    }
    getPaidAds(){
        return this.http.get<Array<{_id:string}>>(this.url + "api/duo/getPaidAds")
    }
    getDuoPaidAds(){
        return this.http.get<Array<{_id:string}>>(this.url + "api/duo/getDuoPaidAds")
    }
    deletePaidAds(){
        return this.http.get<{message:string}>(this.url + "api/duo/deletePaidAds")
    }
    deletePaidAd(deletePaidAd:string){
        return this.http.post<{message:string}>(this.url + "api/duo/deletePaidAd" , {deletePaidAd:deletePaidAd});
    }
    addBlackListToServer(blackList:Array<object>){
        return this.http.post<{message:string}>(this.url + "api/duo/addBlackList" , {blackList:blackList});
    }
    getBlackList(){
        return this.http.get<Array<object>>(this.url + "api/duo/getBlackList")
    }
    deleteBlackList(){
        return this.http.get<{message:string}>(this.url + "api/duo/deleteBlackList")
    }
    getDuoPagesStates(){
        return this.http.get<{exist:boolean,error:boolean,
                registerTeamLeaderChampionshipType:boolean,
                registerMemberChampionshipType:boolean,
                registerFreeAdsType:boolean,
                registerReportHackerType:boolean,
                appearHackerAndWinnersPubg:boolean,
                splitPlayersType:boolean}>(this.url+"api/duo/getPagesState");
    }
    registerTeamLeaderTrue(){
        return this.http.get<{message:string}>(this.url + "api/duo/registerTeamLeaderTrue");
    }
    registerMemberTrue(){
        return this.http.get<{message:string}>(this.url + "api/duo/registerMemberTrue");
    }
    setFreeAdsTypeTrue(){
        return this.http.get<{message:string}>(this.url + "api/duo/setFreeAdsTypeTrue");
    }
    setReportHackerTypeTrue(){
        return this.http.get<{message:string}>(this.url + "api/duo/setReportHackerTypeTrue");
    }
    setAppearHackerAndWinnersTrue(){
        return this.http.get<{message:string}>(this.url + "api/duo/setAppearHackerAndWinnersTrue");
    }
    setSplitPlayersTypeTrue(){
        return this.http.get<{message:string}>(this.url + "api/duo/setSplitPlayersTypeTrue");
    }
    registerTeamLeaderFalse(){
        return this.http.get<{message:string}>(this.url + "api/duo/registerTeamLeaderFalse");
    }
    registerMemberFalse(){
        return this.http.get<{message:string}>(this.url + "api/duo/registerMemberFalse");
    }
    setFreeAdsTypeFalse(){
        return this.http.get<{message:string}>(this.url + "api/duo/setFreeAdsTypeFalse");
    }
    setReportHackerTypeFalse(){
        return this.http.get<{message:string}>(this.url + "api/duo/setReportHackerTypeFalse");
    }
    setAppearHackerAndWinnersFalse(){
        return this.http.get<{message:string}>(this.url + "api/duo/setAppearHackerAndWinnersFalse");
    }
    setSplitPlayersTypeFalse(){
        return this.http.get<{message:string}>(this.url + "api/duo/setSplitPlayersTypeFalse");
    }
    getRegisterAds(){
        return this.http.get<Array<{videoId:string, email:string, adAppearanceCountry:string}>>(this.url + "api/duo/getRegisterAds")
    }
    addFreeAdToServer(videoId:string ,email:string ,adCountry:string){
        return this.http.post<{message:string}>(this.url + "api/duo/addFreeAdToServer" , {videoId:videoId ,email:email ,adCountry:adCountry});
    }
    getAdsWillAppear(numberAds:number){
        return this.http.get<Array<object>>(this.url + "api/duo/getAdsWillAppear?adsnumber="+numberAds)
    }
    addAdsWillAppear(ads:Array<object>){
        return this.http.post<{message:string}>(this.url + "api/duo/addAdsWillAppear",{ads:ads})
    }
    getRealAdsWillAppear(){
        return this.http.get<Array<object>>(this.url + "api/duo/getRealAdsWillAppear")
    }
    getRealAdsWillAppearServer(){
        return this.http.get<{ads:object}>(this.url + "api/duo/getAdsWillAppearserver")
    }
    deleteAdsWillAppear(){
        return this.http.get<{message:string}>(this.url + "api/duo/deleteAdsWillAppear")
    }
    deleteFreeAd(deleteFreeAd:string){
        return this.http.post<{message:string}>(this.url + "api/squad/deleteFreeAd" , {deleteFreeAd:deleteFreeAd});
    }
    adsFromDatabaseToServer(){
        return this.http.get<{message:string}>(this.url + "api/duo/adsFromDatabaseToServer")
    }

    addPlayer(pubgIdTeamLeader:string , pubgIdMember:string){
        return this.http.post<{message:string}>(this.url + "api/duo/addPlayer",{pubgIdTeamLeader:pubgIdTeamLeader , pubgIdMember:pubgIdMember});
    }
    deletePlayer(pubgId:string){
        return this.http.get<{message:string}>(this.url + "api/duo/deletePlayer?pubgId="+pubgId)
    }
    getIdsPubg(){
        return this.http.get<Array<{pubgIdTeamLeader:string , pubgIdMember:string}>>(this.url+"api/duo/getPubgIds");
    }
    addSplitPlayer(round:number , data:Array<object>){
        return this.http.post<{message:string}>(this.url + "api/duo/splitPlayer" , {round:round , data:data});
    }
    getSplitPlayer(){
        return this.http.get<{round:number,data:Array<object>}>(this.url + "api/duo/getSplitPlayer");
    }
    getSplitPlayerNoConnect(){
        return this.http.get<Array<object>>(this.url + "api/duo/getSplitPlayerNoConnect");
    }
    deleteSplitPlayers(){
        return this.http.get<{message:string}>(this.url + "api/duo/deleteSplitPlayers");
    }
    sPFromDatabaseToServer(){
        return this.http.get<{message:string}>(this.url + "api/duo/sPFromDatabaseToServer");
    }
    getRegisterHackers(){
        return this.http.get<Array<object>>(this.url+"api/duo/getRegisterHackers");
    }
    getEmailHacker(idPubg:string){
        return this.http.post<{message:string}>(this.url + "api/duo/getEmailHacker" , {idPubg:idPubg});
    }
    addHackersAndWinners(data:object){
        return this.http.post<{message:string}>(this.url + "api/duo/addHackersAndWinners" , {data:data});
    }
    getLastHackersWinnersRound(){
        return this.http.get<{round:number,realHacker:Array<object>,winnersPubgId:Array<object>}>(this.url + "api/squad/getLastHackersWinnersRound");
    }
    getReportHackers(){
        return this.http.get<Array<object>>(this.url+"api/duo/getReportHackers");
    }
    getReportHackersNoConnect(){
        return this.http.get<Array<string>>(this.url+"api/duo/getReportHackersNoConnect");
    }
    getWinnersPubg(){
        return this.http.get<Array<string>>(this.url+"api/duo/getWinnersPubg");
    }
    getWinnersPubgNoConnect(){
        return this.http.get<Array<string>>(this.url+"api/duo/getWinnersPubgNoConnect");
    }
    deleteHackersAndWinners(){
        return this.http.get<{message:string}>(this.url + "api/duo/deleteHackersAndWinners");
    }
    hAWFromDatabaseToServer(){
        return this.http.get<{message:string}>(this.url + "api/duo/hAWFromDatabaseToServer");
    }
}