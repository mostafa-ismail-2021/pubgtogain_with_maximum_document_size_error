import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class soloAdmin {

    private url:string = "http://localhost:3000/";

    constructor(private http:HttpClient) { }
    addChampion(startDate:string,playerNumber:number){
        return this.http.post<{message:string}>(this.url + "api/solo/addChampion" , {startDate:startDate , totalPlayersNumber:playerNumber});
    }
    endChampion(endDate:string){
        return this.http.post<{message:string}>(this.url + "api/solo/endChampion" , {endDate:endDate});
    }
    addCharityAdsToServer(charityAds:Array<object>){
        return this.http.post<{message:string}>(this.url + "api/solo/addCharityAds" , {charityAds:charityAds});
    }
    getCharityAds(){
        return this.http.get<Array<object>>(this.url + "api/solo/getCharityAds")
    }
    getCharityAdsServer(){
        return this.http.get<{ads:object}>(this.url + "api/solo/getCharityAdsServer")
    }
    deleteCharityAds(){
        return this.http.get<{message:string}>(this.url + "api/solo/deleteCharityAds")
    }
    charityAdsFromDatabaseToServer(){
        return this.http.get<{message:string}>(this.url + "api/solo/CharityAdsFromDatabaseToServer")
    }
    addPaidAdsToServer(paidAds:Array<string>){
        return this.http.post<{message:string}>(this.url + "api/solo/addPaidAdsToServer" , {paidAds:paidAds});
    }
    addPaidAdToServer(paidAd:string){
        return this.http.post<{message:string}>(this.url + "api/solo/addPaidAdToServer" , {paidAd:paidAd});
    }
    getPaidAds(){
        return this.http.get<Array<{_id:string}>>(this.url + "api/solo/getPaidAds")
    }
    getSoloPaidAds(){
        return this.http.get<Array<{_id:string}>>(this.url + "api/solo/getSoloPaidAds")
    }
    deletePaidAds(){
        return this.http.get<{message:string}>(this.url + "api/solo/deletePaidAds")
    }
    deletePaidAd(deletePaidAd:string){
        return this.http.post<{message:string}>(this.url + "api/solo/deletePaidAd" , {deletePaidAd:deletePaidAd});
    }
    addBlackListToServer(blackList:Array<object>){
        return this.http.post<{message:string}>(this.url + "api/solo/addBlackList" , {blackList:blackList});
    }
    getBlackList(){
        return this.http.get<Array<object>>(this.url + "api/solo/getBlackList")
    }
    deleteBlackList(){
        return this.http.get<{message:string}>(this.url + "api/solo/deleteBlackList")
    }
    getSoloPagesStates(){
        return this.http.get<{exist:boolean,error:boolean,
                registerChampionshipType:boolean,
                registerFreeAdsType:boolean,
                registerReportHackerType:boolean,
                appearHackerAndWinnersPubg:boolean,
                splitPlayersType:boolean}>(this.url+"api/solo/getPagesState");
    }
    setChampionshipTypetrue(){
        return this.http.get<{message:string}>(this.url + "api/solo/setChampionshipTypeTrue");
    }
    setFreeAdsTypeTrue(){
        return this.http.get<{message:string}>(this.url + "api/solo/setFreeAdsTypeTrue");
    }
    setReportHackerTypeTrue(){
        return this.http.get<{message:string}>(this.url + "api/solo/setReportHackerTypeTrue");
    }
    setAppearHackerAndWinnersTrue(){
        return this.http.get<{message:string}>(this.url + "api/solo/setAppearHackerAndWinnersTrue");
    }
    setSplitPlayersTypeTrue(){
        return this.http.get<{message:string}>(this.url + "api/solo/setSplitPlayersTypeTrue");
    }
    setChampionshipTypeFalse(){
        return this.http.get<{message:string}>(this.url + "api/solo/setChampionshipTypeFalse");
    }
    setFreeAdsTypeFalse(){
        return this.http.get<{message:string}>(this.url + "api/solo/setFreeAdsTypeFalse");
    }
    setReportHackerTypeFalse(){
        return this.http.get<{message:string}>(this.url + "api/solo/setReportHackerTypeFalse");
    }
    setAppearHackerAndWinnersFalse(){
        return this.http.get<{message:string}>(this.url + "api/solo/setAppearHackerAndWinnersFalse");
    }
    setSplitPlayersTypeFalse(){
        return this.http.get<{message:string}>(this.url + "api/solo/setSplitPlayersTypeFalse");
    }
    getRegisterAds(){
        return this.http.get<Array<{videoId:string, email:string, adAppearanceCountry:string}>>(this.url + "api/solo/getRegisterAds")
    }
    addFreeAdToServer(videoId:string ,email:string ,adCountry:string){
        return this.http.post<{message:string}>(this.url + "api/solo/addFreeAdToServer" , {videoId:videoId ,email:email ,adCountry:adCountry});
    }
    getAdsWillAppear(numberAds:number){
        return this.http.get<Array<object>>(this.url + "api/solo/getAdsWillAppear?adsnumber="+numberAds)
    }
    addAdsWillAppear(ads:Array<object>){
        return this.http.post<{message:string}>(this.url + "api/solo/addAdsWillAppear",{ads:ads})
    }
    getRealAdsWillAppear(){
        return this.http.get<Array<object>>(this.url + "api/solo/getRealAdsWillAppear")
    }
    getRealAdsWillAppearServer(){
        return this.http.get<{ads:object}>(this.url + "api/solo/getAdsWillAppearserver")
    }
    deleteAdsWillAppear(){
        return this.http.get<{message:string}>(this.url + "api/solo/deleteAdsWillAppear")
    }
    deleteFreeAd(deleteFreeAd:string){
        return this.http.post<{message:string}>(this.url + "api/solo/deleteFreeAd" , {deleteFreeAd:deleteFreeAd});
    }
    adsFromDatabaseToServer(){
        return this.http.get<{message:string}>(this.url + "api/solo/adsFromDatabaseToServer")
    }

    addPlayer(pubgId:string){
        return this.http.get<{message:string}>(this.url + "api/solo/addPlayer?pubgId="+pubgId)
    }
    deletePlayer(pubgId:string){
        return this.http.get<{message:string}>(this.url + "api/solo/deletePlayer?pubgId="+pubgId)
    }
    getIdsPubg(){
        return this.http.get<Array<{pubgId:string}>>(this.url+"api/solo/getPubgIds");
    }
    addSplitPlayer(round:number , data:Array<object>){
        return this.http.post<{message:string}>(this.url + "api/solo/splitPlayer" , {round:round , data:data});
    }
    getSplitPlayer(){
        return this.http.get<{round:number,data:Array<object>}>(this.url + "api/solo/getSplitPlayer");
    }
    getSplitPlayerNoConnect(){
        return this.http.get<Array<object>>(this.url + "api/solo/getSplitPlayerNoConnect");
    }
    deleteSplitPlayers(){
        return this.http.get<{message:string}>(this.url + "api/solo/deleteSplitPlayers");
    }
    sPFromDatabaseToServer(){
        return this.http.get<{message:string}>(this.url + "api/solo/sPFromDatabaseToServer");
    }
    getRegisterHackers(){
        return this.http.get<Array<object>>(this.url+"api/solo/getRegisterHackers");
    }
    getEmailHacker(idPubg:string){
        return this.http.post<{message:string}>(this.url + "api/solo/getEmailHacker" , {idPubg:idPubg});
    }
    addHackersAndWinners(data:object){
        return this.http.post<{message:string}>(this.url + "api/solo/addHackersAndWinners" , {data:data});
    }
    getLastHackersWinnersRound(){
        return this.http.get<{round:number,realHacker:Array<object>,winnersPubgId:Array<object>}>(this.url + "api/solo/getLastHackersWinnersRound");
    }
    getReportHackers(){
        return this.http.get<Array<object>>(this.url+"api/solo/getReportHackers");
    }
    getReportHackersNoConnect(){
        return this.http.get<Array<string>>(this.url+"api/solo/getReportHackersNoConnect");
    }
    getWinnersPubg(){
        return this.http.get<Array<string>>(this.url+"api/solo/getWinnersPubg");
    }
    getWinnersPubgNoConnect(){
        return this.http.get<Array<string>>(this.url+"api/solo/getWinnersPubgNoConnect");
    }
    deleteHackersAndWinners(){
        return this.http.get<{message:string}>(this.url + "api/solo/deleteHackersAndWinners");
    }
    hAWFromDatabaseToServer(){
        return this.http.get<{message:string}>(this.url + "api/solo/hAWFromDatabaseToServer");
    }
}