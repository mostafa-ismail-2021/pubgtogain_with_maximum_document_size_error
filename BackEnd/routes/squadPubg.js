const express = require('express');
const squadPubgRouters = express.Router();
const squadPubgChampionship = require('../models/squadPubgChampionship');
const adminSchema = require('../models/adminSchema');
const paidAds = require('../models/paidAds');
const nodemailer = require('nodemailer');
const geoip = require('geoip-lite');
const checkAuth = require('../middleware/check-auth');
const mongoose = require('mongoose');
var squadCharityAds = {};
var squadFreeAds = {};
var squadSplitPlayers = []
var squadReportHacke = [];
var squadWinnersPubg = [];
var squadApperHackerAndWinners = false;
  

function squadGetAdNoConnect(country){
    let sendData = {
      register : false,
      videoId : null,
      videoType : "noType",
      adAppearanceCountry:null
    };
    if(typeof squadFreeAds !== 'undefined' && Object.keys(squadFreeAds).length != 0 && (squadFreeAds.ALL != undefined || squadFreeAds[country] != undefined)){
      if(squadFreeAds.ALL != undefined && squadFreeAds[country] != undefined){
        let AllCountery = ["ALL" , country];
        let adAppearanceCountry = AllCountery[Math.floor(AllCountery.length * Math.random())];
        let videoId = squadFreeAds[adAppearanceCountry][Math.floor(squadFreeAds[adAppearanceCountry].length * Math.random())]
        sendData={
          register : false,
          videoId : videoId,
          videoType : "noType",
          adAppearanceCountry:adAppearanceCountry
        }
      }
      else if(squadFreeAds.ALL != undefined){
        let videoId = squadFreeAds["ALL"][Math.floor(squadFreeAds["ALL"].length * Math.random())];
        sendData={
          register : false,
          videoId : videoId,
          videoType : "noType",
          adAppearanceCountry:"ALL"
        }
      }
      else{
        let videoId = squadFreeAds[country][Math.floor(squadFreeAds[country].length * Math.random())];
        sendData={
          register : false,
          videoId : videoId,
          videoType : "noType",
          adAppearanceCountry:country
        }
      }
    }
    else{
      if(squadCharityAds.ALL != undefined && squadCharityAds[country] != undefined){
        let AllCountery = ["ALL" , country];
        let adAppearanceCountry = AllCountery[Math.floor(AllCountery.length * Math.random())];
        let videoId = squadCharityAds[adAppearanceCountry][Math.floor(squadCharityAds[adAppearanceCountry].length * Math.random())]
        sendData={
          register : false,
          videoId : videoId,
          videoType : "noType",
          adAppearanceCountry:adAppearanceCountry
        }
      }
      else if(squadCharityAds.ALL != undefined){
        let videoId = squadCharityAds["ALL"][Math.floor(squadCharityAds["ALL"].length * Math.random())];
        sendData={
          register : false,
          videoId : videoId,
          videoType : "noType",
          adAppearanceCountry:"ALL"
        }
      }
      else{
        let videoId = squadCharityAds[country][Math.floor(squadCharityAds[country].length * Math.random())];
        sendData={
          register : false,
          videoId : videoId,
          videoType : "noType",
          adAppearanceCountry:country
        }
      }
    }
    return sendData;
  }
  
  squadPubgRouters.post("/sendEmailConfirm",(req ,res)=>{
    const email = req.body.Email;
    let Random = Math.floor(Math.random() * (99999 - 10000 + 1) ) + 10000;
    try{
    /*
  
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'championshipbattleground@gmail.com',
          pass: 'mostafa258852'
        }
      });
      
      var mailOptions = {
        from: 'championshipbattleground@gmail.com',
        to: email,
        subject: 'confirm your register in championshipBattleGround',
        text: 'the confirm number : '+Random
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
  */
    console.log(Random);
    res.status(201).json({random:Random});
    }
    catch(error)
    {
      res.status(201).json({random:null});
    }
  });
  
  squadPubgRouters.put('/increaseVideoId',(req,res)=>{
    let videoType = req.body.videoType;
    let videoId = req.body.videoId;
    let adAppearanceCountry = req.body.adAppearanceCountry;
    if(videoType == 'paid')
    {
      paidAds.updateOne(
        {
          videoId:videoId ,
          adAppearanceCountry:adAppearanceCountry,
          $expr: { $gt: [ "$totalViews" , "$viewsNumber" ] } 
        },
        {
          $inc: { viewsNumber: 1}
        }
      ).then(e=>{res.status(200).json(true);}).catch(error => res.status(200).json(false));
    }
    else if(videoType == 'free')
    {
      squadPubgChampionship.updateOne(
        {
          endDate:"no date added",
          "freeAds.adsWillAppear":{
             $elemMatch: {
                videoId: { $eq: videoId },
                adAppearanceCountry: { $eq: adAppearanceCountry } 
              } 
          } ,
        },
        {
          $inc: { "freeAds.adsWillAppear.$.viewsNumber": 1}
        }
      ).then(e=>{res.status(200).json(true);}).catch(error => res.status(200).json(false));
    }
    else if(videoType == 'charity')
    {
      squadPubgChampionship.updateOne(
        {
          endDate:"no date added",
          "charityAds":{
             $elemMatch: {
                videoId: { $eq: videoId },
                adAppearanceCountry: { $eq: adAppearanceCountry } 
              } 
          } ,
        },
        {
          $inc: { "charityAds.$.viewsNumber": 1}
        }
      ).then(e=>{res.status(200).json(true);}).catch(error => res.status(200).json(false));
    }
    else{
      res.status(200).json(false)
    }
  });
  
  squadPubgRouters.post("/teamLeaderReGetAd", (req,res)=>{  //re mean register
    let country = undefined ;
    if(req.body.ip != undefined){
      let conuntryData = geoip.lookup(req.body.ip);
      if(conuntryData != null){
        country = conuntryData.country;
      }
    }
    if(mongoose.connection.readyState == 1){
        
      squadPubgChampionship.aggregate([
        {
          $match: { endDate: "no date added" }
        },
        {
          $lookup: {
            from: "paidads",
            localField: "paidAds._id",    // field in the orders collection
            foreignField: "_id",  // field in the items collection
            as: "paidVideos"
          }
        },
        {  
          $project : {
            _id:0,
            register:{
              $cond: {
                if: {
                  $and: [
                    { 
                      $or: [
                        { $gt: [ "$totalPlayersNumber" , { $size: { $ifNull: [ "$players", [] ] } } ] },
                        {  $eq: [ "$totalPlayersNumber",  0 ] } 
                      ]  
                    },
                    { $eq: [ "$registerTeamLeaderChampionshipType",  true ] },
                  ]
                  
                },
                then: true,
                else: false
              }
            },
            filterPaidads:{
              $cond: {
                if: {
                  $gt: [ {$size: { $ifNull: [ "$paidVideos", [] ] }}, 0 ]
                },
                then:{
                  $filter: {
                    input: "$paidVideos",
                    as: "paidVideo",
                    cond: { 
                      $and: [
                        { 
                          $gt: [ "$$paidVideo.totalViews", "$$paidVideo.viewsNumber" ]
                        },
                        { 
                          $or: [
                            { $eq: [ "$$paidVideo.adAppearanceCountry" ,"ALL" ]},
                            { $eq: [ "$$paidVideo.adAppearanceCountry",  country ] } 
                          ]  
                        },
                      ]
                    }
                }
                },
                else:[]
              }
            },
            filterfreeads:{
              $cond: {
                if: {
                  $gt: [ {$size: { $ifNull: [ "$freeAds.adsWillAppear", [] ] }}, 0 ]
                },
                then:{
                  $filter: {
                    input: "$freeAds.adsWillAppear",
                    as: "freeAd",
                    cond: { 
                      $or: [
                        { $eq: [ "$$freeAd.adAppearanceCountry" ,"ALL" ]},
                        { $eq: [ "$$freeAd.adAppearanceCountry",  country ] } 
                      ] 
                    }
                }
                },
                else:[]
              }
            },
            filtercharityads:{
              $cond: {
                if: {
                  $gt: [ {$size: { $ifNull: [ "$charityAds", [] ] }}, 0 ]
                },
                then:{
                  $filter: {
                    input: "$charityAds",
                    as: "charityAd",
                    cond: { 
                      $or: [
                        { $eq: [ "$$charityAd.adAppearanceCountry" ,"ALL" ]},
                        { $eq: [ "$$charityAd.adAppearanceCountry",  country ] } 
                      ] 
                    }
                }
                },
                else:[]
              }
            }
          }
          
        },
        {
          $project : {
            register:1,
            ads:{
              $cond: {
                if: {
                  $gt: [ {$size:"$filterPaidads"}, 0 ],
                },
                then: {
                  videoId : "$filterPaidads.videoId",
                  videoType:"paid",
                  adAppearanceCountry:"$filterPaidads.adAppearanceCountry"
                },
                else: {
                  $cond: {
                    if:{
                      $gt: [ {$size: { $ifNull: [ "$filterfreeads", [] ] }}, 0 ]
                    },
                    then: {
                      videoId:"$filterfreeads.videoId",
                      videoType:"free",
                      adAppearanceCountry:"$filterfreeads.adAppearanceCountry"
                    },
                    else:{
                      videoId:"$filtercharityads.videoId",
                      videoType:"charity",
                      adAppearanceCountry:"$filtercharityads.adAppearanceCountry"
                    }
                  }
                }
              }
            },
          }
        }
      ]).then(data =>{
        let sendData = {
          register : false,
          videoId : null,
          videoType : null,
          adAppearanceCountry:null
        };
        if(data.length != 0){
          let randomIndex = Math.floor(Math.random()*data[0].ads.videoId.length)
          sendData={
            register : data[0].register,
            videoId : data[0].ads.videoId[randomIndex],
            videoType : data[0].ads.videoType,
            adAppearanceCountry:data[0].ads.adAppearanceCountry[randomIndex],
          }
        }
        else{
          sendData = squadGetAdNoConnect(country);
        }
        res.status(200).json(sendData);
      })
      .catch(error => {
         console.log("error squad team leader register get ad");
         console.log(error);
         let sendData = squadGetAdNoConnect(country);
         res.status(200).json(sendData);
       });
    }
    else{
      let sendData = squadGetAdNoConnect(country);
      res.status(200).json(sendData);
    }
   });
   

  /*app.get("/api/checksquadtlusername",(req,res)=>{//tl mean team leader
    
    let userName = req.query.username;
    squadPubgChampionship.aggregate([
      {
        $match:
          { 
            $and:
            [
              {endDate:"no date added"},
              {"players.userNameTeamLeader": userName}
            ]
          }
      },
      {
        $project:{
          _id:0,
          registerChampionshipType:1
        }
      }
    ])
    .then(data => {
      if(data.length == 0 ){
        res.status(200).json({acceptData:true,error:false,oldUserName:userName});
      }else{
        res.status(200).json({acceptData:false,error:false,oldUserName:userName});
      }
    })
    .catch(error=>{console.log("error in checksquadtlusername");console.log(error); res.status(200).json({acceptData:true,error:true,oldUserName:userName});});
  });
  */
  
 squadPubgRouters.get("/checkTLGmailAccount",(req,res)=>{
    let gmailaccount = req.query.gmailaccount;
    console.log(gmailaccount);
    squadPubgChampionship.aggregate([
      { 
        $match:
          { $and:
            [
              {endDate:{ $eq: "no date added"}},
              {
                $or: [
                  {"players.emailTeamLeader":{ $eq: gmailaccount}},
                  {"blackList.email":{ $eq: gmailaccount}},
                ]
              } 
            ]
          }
      },
      {
        $project:{
          _id:0,
          registerChampionshipType:1
        }
      }
    ])
    .then(data => {
      if(data.length == 0 ){
        res.status(200).json({acceptData:true,error:false,oldGmail:gmailaccount});
      }else{
        res.status(200).json({acceptData:false,error:false,oldGmail:gmailaccount});
      }
    })
    .catch(error=>{console.log("error in checksquadtlgmailaccount");console.log(error); res.status(200).json({acceptData:false,error:true,oldGmail:gmailaccount});});
  });
  
  squadPubgRouters.get("/checkTLIdPubg",(req,res)=>{
    
    let idPubg = req.query.idpubg;
    squadPubgChampionship.aggregate([
      {
        $match:
          { $and:
            [
              {endDate:{ $eq: "no date added"}},
              {
                $or: [
                  {"players.pubgIdTeamLeader":{ $eq: idPubg}},
                  {"players.pubgIdFirstMember":{ $eq: idPubg}},
                  {"players.pubgIdSecondMember":{ $eq: idPubg}},
                  {"players.pubgIdThirdMember":{ $eq: idPubg}},
                  {"blackList.pubgId":{ $eq: idPubg}},
                ] 
              } 
            ]
          }
      },
      {
        $project:{
          _id:0,
          registerChampionshipType:1
        }
      }
    ])
    .then(data => {
      if(data.length == 0 ){
        res.status(200).json({acceptData:true,error:false,oldIdPubg:idPubg});
      }else{
        res.status(200).json({acceptData:false,error:false,oldIdPubg:idPubg});
      }
    })
    .catch(error=>{console.log("error in checksquadtlidpubg");console.log(error); res.status(200).json({acceptData:false,error:true,oldIdPubg:idPubg});});
  });
  
  squadPubgRouters.get("/checkTLFIdPubg",(req,res)=>{//tlf mean team leader friend
    
    let idPubg = req.query.idpubg;
    squadPubgChampionship.aggregate([
      {
        $match:
          { $and:
            [
              {endDate:{ $eq: "no date added"}},
              {
                $or: [
                  {"players.pubgIdTeamLeader":{ $eq: idPubg}},
                  {"players.pubgIdFirstMember":{ $eq: idPubg}},
                  {"players.pubgIdSecondMember":{ $eq: idPubg}},
                  {"players.pubgIdThirdMember":{ $eq: idPubg}},
                  {"blackList.pubgId":{ $eq: idPubg}},
                ] 
              } 
            ]
          }
      },
      {
        $project:{
          _id:0,
          registerChampionshipType:1
        }
      }
    ])
    .then(data => {
      if(data.length == 0 ){
        res.status(200).json({acceptData:true,error:false,oldMemberIdPubg:idPubg});
      }else{
        res.status(200).json({acceptData:false,error:false,oldMemberIdPubg:idPubg});
      }
    })
    .catch(error=>{console.log("error in checksquadtlfidpubg");console.log(error); res.status(200).json({acceptData:false,error:true,oldMemberIdPubg:idPubg});});
  
  });
  
  squadPubgRouters.post("/tLSendData",(req ,res)=>{
    squadPubgChampionship.aggregate([
      {
        $match: { endDate: "no date added" }
      },
      {
        $project : {
          _id:0,
          register:{
            $cond: {
              if: {
                $and: [
                  { 
                    $or: [
                      { $gt: [ "$totalPlayersNumber" , { $size: { $ifNull: [ "$players", [] ] } } ] },
                      {  $eq: [ "$totalPlayersNumber",  0 ] } 
                    ]  
                  },
                  { $eq: [ "$registerTeamLeaderChampionshipType",  true ] },
                ]
                
              },
              then: true,
              else: false
            }
          }
        }
      }
    ]).then(register=>{console.log(register);
      if(register.length > 0 /*&& req.body.userName != undefined */&& req.body.email != undefined 
        && req.body.pubgId != undefined && req.body.firstMemberPubgId != undefined 
        && req.body.secondMemberPubgId != undefined && req.body.thirdMemberPubgId != undefined 
        && req.body.pubgId != req.body.firstMemberPubgId && req.body.pubgId != req.body.secondMemberPubgId 
        && req.body.pubgId != req.body.thirdMemberPubgId && req.body.firstMemberPubgId != req.body.secondMemberPubgId 
        && req.body.firstMemberPubgId != req.body.thirdMemberPubgId && req.body.secondMemberPubgId != req.body.thirdMemberPubgId)
      {
        if(register[0].register == true){
  
          if(req.body.videoId == undefined)
          {
            req.body.videoId = "error occur";
          }
          let idPubg = req.body.pubgId;
          let firstmemberPubgId = req.body.firstMemberPubgId;
          let secondmemberPubgId = req.body.secondMemberPubgId;
          let thirdmemberPubgId = req.body.thirdMemberPubgId;
          squadPubgChampionship.findOneAndUpdate(
            {
              endDate:"no date added",
              "players.emailTeamLeader": { $not: { $in: [req.body.email] } },
             /*"players.userNameTeamLeader": { $not: { $in: [req.body.userName] } },
             "players.emailTeamLeader": { $not: { $in: [req.body.email] } },
  
             "players.pubgIdTeamLeader": { $not: { $in: [idPubg] } },
             "players.pubgIdTeamLeader": { $not: { $in: [firstmemberPubgId] } },
             "players.pubgIdTeamLeader": { $not: { $in: [secondmemberPubgId] } },
             "players.pubgIdTeamLeader": { $not: { $in: [thirdmemberPubgId] } },
  
             "players.pubgIdFirstMember": { $not: { $in: [idPubg] } },
             "players.pubgIdFirstMember": { $not: { $in: [firstmemberPubgId] } },
             "players.pubgIdFirstMember": { $not: { $in: [secondmemberPubgId] } },
             "players.pubgIdFirstMember": { $not: { $in: [thirdmemberPubgId] } },
             
             "players.pubgIdSecondMember": { $not: { $in: [idPubg] } },
             "players.pubgIdSecondMember": { $not: { $in: [firstmemberPubgId] } },
             "players.pubgIdSecondMember": { $not: { $in: [secondmemberPubgId] } },
             "players.pubgIdSecondMember": { $not: { $in: [thirdmemberPubgId] } },
  
             "players.pubgIdThirdMember": { $not: { $in: [idPubg] } },
             "players.pubgIdThirdMember": { $not: { $in: [firstmemberPubgId] } },
             "players.pubgIdThirdMember": { $not: { $in: [secondmemberPubgId] } },
             "players.pubgIdThirdMember": { $not: { $in: [thirdmemberPubgId] } },*/
            },
            {
              $push: { players: { $each: [ {emailTeamLeader : req.body.email , pubgIdTeamLeader : idPubg , pubgIdFirstMember : firstmemberPubgId , pubgIdSecondMember : secondmemberPubgId , pubgIdThirdMember : thirdmemberPubgId, displayedAdTeamLeader : req.body.videoId} ] } }
            },
            {
              runValidators: true,
              projection: { "_id" : 0, "registerTeamLeaderChampionshipType" : 1 }
            }
          ).then(data=>{
            if(data != null && data.registerTeamLeaderChampionshipType){
              res.status(201).json({message:"your Registration in championShip is done"});
            }
            else{
              console.log('error in  tlSquadSendData in findOneAndUpdate in nModified');
              res.status(201).json({message:"an error occur please register again"});
            }
          })
          .catch(error=>{console.log('error in  tlSquadSendData in findOneAndUpdate');console.log(error);  res.status(201).json({message:"error because overloads of server. register after some minutes when overloads of server go down"});});
            
        }
        else{
          res.status(201).json({message:"sorry register is finished when you added your data"});
        }
      }
      else{console.log('error in  tlSquadSendData in aggregate in undefinde data');
        res.status(201).json({ message:"an error occur please register again"});
      }
    }).catch(error=>{console.log('error in  tlSquadSendData in aggregate');console.log(error); res.status(201).json({message:"error because overloads of server. register after some minutes when overloads of server go down"});});
  });
  
  squadPubgRouters.post("/memberReGetAd", (req,res)=>{  //re mean register
    let country = undefined ;
    if(req.body.ip != undefined){
      let conuntryData = geoip.lookup(req.body.ip);
      if(conuntryData != null){
        country = conuntryData.country;
      }
    }
    if(mongoose.connection.readyState == 1){
        
      squadPubgChampionship.aggregate([
        {
          $match: { endDate: "no date added" }
        },
        {
          $lookup: {
            from: "paidads",
            localField: "paidAds._id",    // field in the orders collection
            foreignField: "_id",  // field in the items collection
            as: "paidVideos"
          }
        },
        {  
          $project : {
            _id:0,
            register:{
              $cond: {
                if: {
                  $eq: [ "$registerMemberChampionshipType",  true ]
                },
                then: true,
                else: false
              }
            },
            filterPaidads:{
              $cond: {
                if: {
                  $gt: [ {$size: { $ifNull: [ "$paidVideos", [] ] }}, 0 ]
                },
                then:{
                  $filter: {
                    input: "$paidVideos",
                    as: "paidVideo",
                    cond: { 
                      $and: [
                        { 
                          $gt: [ "$$paidVideo.totalViews", "$$paidVideo.viewsNumber" ]
                        },
                        { 
                          $or: [
                            { $eq: [ "$$paidVideo.adAppearanceCountry" ,"ALL" ]},
                            { $eq: [ "$$paidVideo.adAppearanceCountry",  country ] } 
                          ]  
                        },
                      ]
                    }
                }
                },
                else:[]
              }
            },
            filterfreeads:{
              $cond: {
                if: {
                  $gt: [ {$size: { $ifNull: [ "$freeAds.adsWillAppear", [] ] }}, 0 ]
                },
                then:{
                  $filter: {
                    input: "$freeAds.adsWillAppear",
                    as: "freeAd",
                    cond: { 
                      $or: [
                        { $eq: [ "$$freeAd.adAppearanceCountry" ,"ALL" ]},
                        { $eq: [ "$$freeAd.adAppearanceCountry",  country ] } 
                      ] 
                    }
                }
                },
                else:[]
              }
            },
            filtercharityads:{
              $cond: {
                if: {
                  $gt: [ {$size: { $ifNull: [ "$charityAds", [] ] }}, 0 ]
                },
                then:{
                  $filter: {
                    input: "$charityAds",
                    as: "charityAd",
                    cond: { 
                      $or: [
                        { $eq: [ "$$charityAd.adAppearanceCountry" ,"ALL" ]},
                        { $eq: [ "$$charityAd.adAppearanceCountry",  country ] } 
                      ] 
                    }
                }
                },
                else:[]
              }
            }
          }
          
        },
        {
          $project : {
            register:1,
            ads:{
              $cond: {
                if: {
                  $gt: [ {$size:"$filterPaidads"}, 0 ],
                },
                then: {
                  videoId : "$filterPaidads.videoId",
                  videoType:"paid",
                  adAppearanceCountry:"$filterPaidads.adAppearanceCountry"
                },
                else: {
                  $cond: {
                    if:{
                      $gt: [ {$size: { $ifNull: [ "$filterfreeads", [] ] }}, 0 ]
                    },
                    then: {
                      videoId:"$filterfreeads.videoId",
                      videoType:"free",
                      adAppearanceCountry:"$filterfreeads.adAppearanceCountry"
                    },
                    else:{
                      videoId:"$filtercharityads.videoId",
                      videoType:"charity",
                      adAppearanceCountry:"$filtercharityads.adAppearanceCountry"
                    }
                  }
                }
              }
            },
          }
        }
      ]).then(data =>{
        let sendData = {
          register : false,
          videoId : null,
          videoType : null,
          adAppearanceCountry:null
        };
        if(data.length != 0){
          let randomIndex = Math.floor(Math.random()*data[0].ads.videoId.length)
          sendData={
            register : data[0].register,
            videoId : data[0].ads.videoId[randomIndex],
            videoType : data[0].ads.videoType,
            adAppearanceCountry:data[0].ads.adAppearanceCountry[randomIndex],
          }
        }
        else{
          sendData = squadGetAdNoConnect(country);
        }
        res.status(200).json(sendData);
      })
      .catch(error => {
        console.log("error squad member register get ad");
        console.log(error);
        let sendData = squadGetAdNoConnect(country);
        res.status(200).json(sendData);
      });
    }
    else{
      let sendData = squadGetAdNoConnect(country);
      res.status(200).json(sendData);
      
    }
  });
  
  /*app.get("/checksquadmusername",(req,res)=>{//m mean member
    
    let userName = req.query.username;
    squadPubgChampionship.aggregate([
      {
        $match:
          { 
            $and:
            [
              {endDate:"no date added"},
              {
                $or: [
                  {"players.userNameTeamLeader":{ $eq: userName}},
                  {"players.userNameFirstMember":{ $eq: userName}},
                  {"players.userNameSecondMember":{ $eq: userName}},
                  {"players.userNameThirdMember":{ $eq: userName}},
                ]
              } 
            ]
          }
      },
      {
        $project:{
          _id:0,
          registerChampionshipType:1
        }
      }
    ])
    .then(data => {
      if(data.length == 0 ){
        res.status(200).json({acceptData:true,error:false,oldUserName:userName});
      }else{
        res.status(200).json({acceptData:false,error:false,oldUserName:userName});
      }
    })
    .catch(error=>{
      console.log('error in checksquadmusername');
      console.log(error);
      res.status(200).json({acceptData:false,error:true,oldUserName:userName});});
  });*/
  
  squadPubgRouters.get("/checkMGmailAccount",(req,res)=>{
    let gmailaccount = req.query.gmailaccount;
    squadPubgChampionship.aggregate([
      { 
        $match:
          { $and:
            [
              {endDate:{ $eq: "no date added"}},
              {
                $or: [
                  {"players.emailTeamLeader":{ $eq: gmailaccount}},
                  {"players.emailFirstMember":{ $eq: gmailaccount}},
                  {"players.emailSecondMember":{ $eq: gmailaccount}},
                  {"players.emailThirdMember":{ $eq: gmailaccount}},
                  {"blackList.email":{ $eq: gmailaccount}},
                ]
              } 
            ]
          }
      },
      {
        $project:{
          _id:0,
          registerChampionshipType:1
        }
      }
    ])
    .then(data => {
      if(data.length == 0 ){
        res.status(200).json({acceptData:true,error:false,oldGmail:gmailaccount});
      }else{
        res.status(200).json({acceptData:false,error:false,oldGmail:gmailaccount});
      }
    })
    .catch(error=>{
      console.log('error in checksquadmgmailaccount');
      console.log(error);
      res.status(200).json({acceptData:false,error:true,oldGmail:gmailaccount});
    });
  
  });
  
  squadPubgRouters.post("/sendMEmailConfirm",(req ,res)=>{
    let pubgId = req.body.pubgId;
    let teamLeaderPubgId = req.body.teamLeaderIdpubg;
    squadPubgChampionship.aggregate([
      {
        $match:
          { 
            endDate:{ $eq: "no date added"}
          }
      },
      {
        $project:{
          _id:0,
          players:1,
          PlaceIdPubg:{
            $cond: {
              if: {
                $in: [ pubgId, "$players.pubgIdFirstMember"],
              },
              then: "first",
              else: {
                $cond: {
                  if: {
                    $in: [ pubgId, "$players.pubgIdSecondMember"],
                  },
                  then: "second",
                  else: {
                    $cond: {
                      if: {
                        $in: [ pubgId, "$players.pubgIdThirdMember"],
                      },
                      then: "third",
                      else: "not exist"
                    }
                  }
                }
              }
            }
          }
        }
      },
      {
        $project:{
          PlaceIdPubg:1,
          players:1,
          checkIdPubg:{
            $cond: {
              if: {
                $ne: [ "$PlaceIdPubg", "not exist" ]
              },
              then: false,
              else: true
            }
          }
        }
      },
      {
        $project:{
          PlaceIdPubg:1,
          checkIdPubg:1,
          filterPlayer:{
            $cond: {
              if: {
                $eq: [ "$checkIdPubg" ,  false] 
              },
              then:{
                $filter: {
                  input: "$players",
                  as: "player",
                  cond: {
                    $and: [
                      { 
                        $eq: [ "$$player.pubgIdTeamLeader", teamLeaderPubgId ]
                      },
                      { 
                        $or: [
                          {$eq: [ "$$player.pubgIdFirstMember", pubgId ]},
                          {$eq: [ "$$player.pubgIdSecondMember", pubgId ]},
                          {$eq: [ "$$player.pubgIdThirdMember", pubgId ]},
                        ]
                      }
                    ]
                  }
               }
              },
              else:[]
            } 
          },
        }
      },
      {
        $project:{
          PlaceIdPubg:1,
          checkIdPubg:1,
          checkTeamleaderIdPubg:{
            $cond: {
              if: {
                $gt: [ {$size: { $ifNull: [ "$filterPlayer", [] ] }}, 0 ]
              },
              then:false,
              else:true,
            }
          },
          checkExistsBefore:{
            $cond: {
              if: {
                $and: [
                  { 
                    $gt: [ {$size: { $ifNull: [ "$filterPlayer", [] ] }}, 0 ]
                  },
                  {
                    $in: [ true, "$filterPlayer.acceptFirstPlayer"]
                  },
                  {
                    $eq:["$PlaceIdPubg" , 'first']
                  }
                ]
              },
              then:true,
              else:{
                $cond: {
                  if: {
                    $and: [
                      { 
                        $gt: [ {$size: { $ifNull: [ "$filterPlayer", [] ] }}, 0 ]
                      },
                      {
                        $in: [ true, "$filterPlayer.acceptSecondPlayer"]
                      },
                      {
                        $eq:["$PlaceIdPubg" , 'second']
                      }
                    ]
                  },
                  then:true,
                  else:{
                    $cond: {
                      if: {
                        $and: [
                          { 
                            $gt: [ {$size: { $ifNull: [ "$filterPlayer", [] ] }}, 0 ]
                          },
                          {
                            $in: [ true, "$filterPlayer.acceptThirdPlayer"]
                          },
                          {
                            $eq:["$PlaceIdPubg" , 'third']
                          }
                        ]
                      },
                      then:true,
                      else:false,
                    }
                  },
                }
              },
            }
          }
        }
      }
    ]).then(data =>{console.log(data[0].checkTeamleaderIdPubg);console.log(data[0].checkIdPubg);
      if(data.length > 0)
      {
        let sendData = {
          random : null,
          checkIdPubg : data[0].checkIdPubg,
          checkTeamleaderIdPubg: data[0].checkTeamleaderIdPubg,
          checkExistsBefore:data[0].checkExistsBefore,
          error:false,
          PlaceIdPubg:data[0].PlaceIdPubg,
        }
        if(sendData.checkTeamleaderIdPubg == false){
          let email = req.body.Email;
          let Random = Math.floor(Math.random() * (99999 - 10000 + 1) ) + 10000;
          sendData.random = Random;
          try{
            /*var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'championshipbattleground@gmail.com',
                  pass: 'mostafa258852'
                }
              });
              
              var mailOptions = {
                from: 'championshipbattleground@gmail.com',
                to: email,
                subject: 'confirm your register in championshipBattleGround',
                text: 'the confirm number : '+Random
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });*/
            console.log(Random);
            res.status(201).json(sendData);
            }
            catch(error)
            {
              sendData.random = null;
              sendData.error = true; 
              res.status(201).json(sendData);
            }
        }
        else{
          res.status(201).json(sendData);
        }
      }
      else{
        let sendData = {
          random : null,
          checkIdPubg : false,
          checkTeamleaderIdPubg: false,
          checkExistsBefore:false,
          error:true,
          PlaceIdPubg:"not exist",
        }
        res.status(201).json(sendData);
      }
    })
    .catch(error =>{
      console.log("error send Email squad member pubg championship");
      console.log(error);
      let sendData = {
        random : null,
        checkIdPubg : false,
        checkTeamleaderIdPubg: false,
        checkExistsBefore:false,
        error:true,
        PlaceIdPubg:"not exist",
      }
      res.status(201).json(sendData);
    })
    
  });
  
  squadPubgRouters.post("/mSendData",(req ,res)=>{
    let idPubg = req.body.pubgId;
    let memberPubgId = req.body.memberPubgId;
    let placeIdPubg = req.body.placeIdPubg;
    if(placeIdPubg == 'first')
    {
      squadPubgChampionship.findOneAndUpdate(
        {
          endDate:"no date added",
          "players.emailTeamLeader": { $not: { $in: [req.body.email] } },
          "players.emailFirstMember": { $not: { $in: [req.body.email] } },
          "players.emailSecondMember": { $not: { $in: [req.body.email] } },
          "players.emailThirdMember": { $not: { $in: [req.body.email] } },
          "players.pubgIdFirstMember":{$in:[idPubg]},
          "players.pubgIdTeamLeader":{$in:[memberPubgId]},
          "players.acceptFirstPlayer":{$in:[false]},
        },
        {
          $set: {
            "players.$.emailFirstMember":req.body.email,
            "players.$.displayedAdFirstMember":req.body.videoId,
            "players.$.acceptFirstPlayer":true,
          },
        },
        {
          runValidators: true,
          projection: { "_id" : 0, "registerMemberChampionshipType" : 1 }
        }
      ).then(data=>{
        if(data != null && data.registerMemberChampionshipType){
          res.status(201).json({message:"your Registration in championShip is done"});
        }
        else{
          console.log("error mSquadSendData in  nModified");
          res.status(201).json({message:"an error occur please register again"});
        }
        })
      .catch(error=>{console.log('error mSquadSendData');console.log(error); res.status(201).json({message:"an error occur please register again"});});
      
    }
    else if(placeIdPubg == 'second')
    {
      squadPubgChampionship.findOneAndUpdate(
        {
          endDate:"no date added",
          "players.emailTeamLeader": { $not: { $in: [req.body.email] } },
          "players.emailFirstMember": { $not: { $in: [req.body.email] } },
          "players.emailSecondMember": { $not: { $in: [req.body.email] } },
          "players.emailThirdMember": { $not: { $in: [req.body.email] } },
          "players.pubgIdSecondMember":{$in:[idPubg]},
          "players.pubgIdTeamLeader":{$in:[memberPubgId]},
          "players.acceptSecondPlayer":{$in:[false]},
        },
        {
          $set: {
            "players.$.emailSecondMember":req.body.email,
            "players.$.displayedAdSecondMember":req.body.videoId,
            "players.$.acceptSecondPlayer":true,
          },
        },
        {
          runValidators: true,
          projection: { "_id" : 0, "registerMemberChampionshipType" : 1 }
        }
      ).then(data=>{
        if(data != null && data.registerMemberChampionshipType){
          res.status(201).json({message:"your Registration in championShip is done"});
        }
        else{
          console.log("error mSquadSendData in  nModified");
          res.status(201).json({message:"an error occur please register again"});
        }
        })
      .catch(error=>{console.log('error mSquadSendData');console.log(error); res.status(201).json({message:"an error occur please register again"});});
      
    } 
    else if(placeIdPubg == 'third') 
    {
      squadPubgChampionship.findOneAndUpdate(
        {
          endDate:"no date added",
          "players.emailTeamLeader": { $not: { $in: [req.body.email] } },
          "players.emailFirstMember": { $not: { $in: [req.body.email] } },
          "players.emailSecondMember": { $not: { $in: [req.body.email] } },
          "players.emailThirdMember": { $not: { $in: [req.body.email] } },
          "players.pubgIdThirdMember":{$in:[idPubg]},
          "players.pubgIdTeamLeader":{$in:[memberPubgId]},
          "players.acceptThirdPlayer":{$in:[false]},
        },
        {
          $set: {
            "players.$.emailThirdMember":req.body.email,
            "players.$.displayedAdThirdMember":req.body.videoId,
            "players.$.acceptThirdPlayer":true,
          },
        },
        {
          runValidators: true,
          projection: { "_id" : 0, "registerMemberChampionshipType" : 1 }
        }
      ).then(data=>{
        if(data != null && data.registerMemberChampionshipType){
          res.status(201).json({message:"your Registration in championShip is done"});
        }
        else{
          console.log("error mSquadSendData in  nModified");
          res.status(201).json({message:"an error occur please register again"});
        }
        })
      .catch(error=>{console.log('error mSquadSendData');console.log(error); res.status(201).json({message:"an error occur please register again"});});
      
    }
    else{
      console.log("error mSquadSendData in  not exist");
      res.status(201).json({message:"an error occur please register again"});
    }
    /*squadPubgChampionship.aggregate([
      
    ])*/
  
      /*squadPubgChampionship.findOneAndUpdate(
      {
        $and: [
          {endDate:{ $eq: "no date added"}},
          {"players.userNameTeamLeader": { $not: { $in: [req.body.userName] } }},
          {"players.userNameFirstMember": { $not: { $in: [req.body.userName] } } },
          {"players.userNameSecondMember": { $not: { $in: [req.body.userName] } }},
          {"players.userNameThirdMember": { $not: { $in: [req.body.userName] } }},
  
          {"players.emailTeamLeader": { $not: { $in: [req.body.email] } }},
          {"players.emailFirstMember": { $not: { $in: [req.body.email] } }},
          {"players.emailSecondMember": { $not: { $in: [req.body.email] } }},
          {"players.emailThirdMember": { $not: { $in: [req.body.email] } }},
  
          {"players.pubgIdTeamLeader": { $not: { $in: [idPubg] } } },
          {"players.pubgIdFirstMember":{ $not: { $in: [memberPubgId] } }},
          {"players.pubgIdSecondMember":{ $not: { $in: [memberPubgId] }} },
          {"players.pubgIdThirdMember":{ $not: { $in: [memberPubgId] } }},
          {"players.pubgIdTeamLeader":{$in:[memberPubgId]}},
          //{"players.userNameTeamLeader":{ $eq: "mostafa ismail hess"}},
          {
            $or: [
              {
                $and : [
                  {"players.pubgIdFirstMember":{$in:[idPubg]}},
                  {"players.acceptFirstPlayer":{$in:[false]}},
                ]
              },
              {
                $and : [
                  {"players.pubgIdSecondMember":{$in:[idPubg]}},
                  {"players.acceptSecondPlayer":{$in:[false]}},
                ]
              },
              {
                $and : [
                  {"players.pubgIdThirdMember":{$in:[idPubg]}},
                  {"players.acceptThirdPlayer":{$in:[false]}},
                ]
              }, 
            ] 
  
          }
        ]
      },
      [{
        $set: { "players.userNameSecondMember.0": { $switch: {
          "players.acceptFirstPlayer": [
              { case: { $eq: false }, then: "A" },
          ],
          default: "F"
        } }  ,
        //$set: {"players.$.userNameSecondMember":'ooooo'
            /*{$cond: {
               if: { $gt: [ 1, 0 ] },
               then: 'ooooooo',
               else: 'iiiiiii'
            }
          }*/
          /*$or : [
            {
              $and:[
                {"players.pubgIdFirstMember":{$in:[idPubg]}},
                {"players.acceptFirstPlayer":{$in:[false]}},
                {"players.$.userNameFirstMember":req.body.userName},
                {"players.$.emailFirstMember":req.body.email},
                {"players.$.displayedAdFirstMember":req.body.videoId},
                {"players.$.acceptFirstPlayer":true},
              ]
            },
          ]
          $cond: {
            if: {
              $eq: [ "acceptFirstPlayer", false ]
            },
            then: {
              "players.$.userNameFirstMember":req.body.userName,
              "players.$.emailFirstMember":"hhhhh",
              "players.$.displayedAdFirstMember":req.body.videoId,
              "players.$.acceptFirstPlayer":true,
            },
            else: {
              $cond: {
                if: {
                  $eq: [ "acceptSecondPlayer", false ]
                },
                then: {
                  "players.$.userNameSecondMember":req.body.userName,
                  "players.$.emailSecondMember":req.body.email,
                  "players.$.displayedAdSecondMember":req.body.videoId,
                  "players.$.acceptSecondPlayer":true,
                },
                else: {
                  "players.$.userNameThirdMember":req.body.userName,
                  "players.$.emailThirdMember":req.body.email,
                  "players.$.displayedAdThirdMember":req.body.videoId,
                  "players.$.acceptThirdPlayer":true,
                }
              },
            }
          },
        },
      }],
      {
        runValidators: true,
        projection: { "_id" : 0, "registerMemberChampionshipType" : 1 }
      }
    ).then(data=>{console.log(data);
      if(data != null && data.registerMemberChampionshipType){
        res.status(201).json({message:"your Registration in championShip is done"});
      }
      else{
        console.log("error mSquadSendData in  nModified");
        res.status(201).json({message:"an error occur please register again"});
      }
      })
    .catch(error=>{console.log('error mSquadSendData');console.log(error); res.status(201).json({message:"an error occur please register again"});});
    */
  });
  
  squadPubgRouters.post("/dateGetAd", (req,res)=>{  //re mean register
    let country = undefined ;
    if(req.body.ip != undefined){
      let conuntryData = geoip.lookup(req.body.ip);
      if(conuntryData != null){
        country = conuntryData.country;
      }
    }
    if(mongoose.connection.readyState == 1){
      squadPubgChampionship.aggregate([
        {
          $match: { endDate: "no date added" }
        },
        {
          $lookup: {
            from: "paidads",
            localField: "paidAds._id",    // field in the orders collection
            foreignField: "_id",  // field in the items collection
            as: "paidVideos"
          }
        },
        {  
          $project : {
            _id:0,
            dateAppearance:{
              $cond: {
                if: {
                  $eq: [ "$splitPlayersType", true ]
                },
                then: true,
                else: false
              }
            },
            filterPaidads:{
              $cond: {
                if: {
                  $gt: [ {$size: { $ifNull: [ "$paidVideos", [] ] }}, 0 ]
                },
                then:{
                  $filter: {
                    input: "$paidVideos",
                    as: "paidVideo",
                    cond: { 
                      $and: [
                        { 
                          $gt: [ "$$paidVideo.totalViews", "$$paidVideo.viewsNumber" ]
                        },
                        { 
                          $or: [
                            { $eq: [ "$$paidVideo.adAppearanceCountry" ,"ALL" ]},
                            { $eq: [ "$$paidVideo.adAppearanceCountry",  country ] } 
                          ]  
                        },
                      ]
                    }
                }
                },
                else:[]
              }
            },
            filterfreeads:{
              $cond: {
                if: {
                  $gt: [ {$size: { $ifNull: [ "$freeAds.adsWillAppear", [] ] }}, 0 ]
                },
                then:{
                  $filter: {
                    input: "$freeAds.adsWillAppear",
                    as: "freeAd",
                    cond: { 
                      $or: [
                        { $eq: [ "$$freeAd.adAppearanceCountry" ,"ALL" ]},
                        { $eq: [ "$$freeAd.adAppearanceCountry",  country ] } 
                      ] 
                    }
                }
                },
                else:[]
              }
            },
            filtercharityads:{
              $cond: {
                if: {
                  $gt: [ {$size: { $ifNull: [ "$charityAds", [] ] }}, 0 ]
                },
                then:{
                  $filter: {
                    input: "$charityAds",
                    as: "charityAd",
                    cond: { 
                      $or: [
                        { $eq: [ "$$charityAd.adAppearanceCountry" ,"ALL" ]},
                        { $eq: [ "$$charityAd.adAppearanceCountry",  country ] } 
                      ] 
                    }
                }
                },
                else:[]
              }
            }
          }
          
        },
        {
          $project : {
            dateAppearance:1,
            ads:{
              $cond: {
                if: {
                  $gt: [ {$size:"$filterPaidads"}, 0 ],
                },
                then: {
                  videoId : "$filterPaidads.videoId",
                  videoType:"paid",
                  adAppearanceCountry:"$filterPaidads.adAppearanceCountry"
                },
                else: {
                  $cond: {
                    if:{
                      $gt: [ {$size: { $ifNull: [ "$filterfreeads", [] ] }}, 0 ]
                    },
                    then: {
                      videoId:"$filterfreeads.videoId",
                      videoType:"free",
                      adAppearanceCountry:"$filterfreeads.adAppearanceCountry"
                    },
                    else:{
                      videoId:"$filtercharityads.videoId",
                      videoType:"charity",
                      adAppearanceCountry:"$filtercharityads.adAppearanceCountry"
                    }
                  }
                }
              }
            },
          }
        }
      ]).then(data =>{
        let sendData = {
          dateAppearance : false,
          videoId : null,
          videoType : null,
          adAppearanceCountry:null
        };
        if(data.length != 0){
          let randomIndex = Math.floor(Math.random()*data[0].ads.videoId.length)
          sendData={
            dateAppearance : data[0].dateAppearance,
            videoId : data[0].ads.videoId[randomIndex],
            videoType : data[0].ads.videoType,
            adAppearanceCountry:data[0].ads.adAppearanceCountry[randomIndex],
          }
        }
        else{
          let tempData = squadGetAdNoConnect(country);
          sendData = {
            dateAppearance : false,
            videoId : tempData.videoId,
            videoType : tempData.videoType,
            adAppearanceCountry:tempData.adAppearanceCountry
          }
        }
        res.status(200).json(sendData);
      })
      .catch(error => {
        console.log("error squad det date get ad");
        console.log(error);
        let tempData = squadGetAdNoConnect(country);
        let sendData = {
          dateAppearance : false,
          videoId : tempData.videoId,
          videoType : tempData.videoType,
          adAppearanceCountry:tempData.adAppearanceCountry
        }
        if(typeof squadSplitPlayers !== 'undefined' && squadSplitPlayers.length != 0)
        {
          sendData.dateAppearance = true;
        }
        res.status(200).json(sendData);
       });
    }
    else{
      let tempData = squadGetAdNoConnect(country);
      let sendData = {
        dateAppearance : false,
        videoId : tempData.videoId,
        videoType : tempData.videoType,
        adAppearanceCountry:tempData.adAppearanceCountry
      }
      if(typeof squadSplitPlayers !== 'undefined' && squadSplitPlayers.length != 0)
      {
        sendData.dateAppearance = true;
      }
      res.status(200).json(sendData);
    }
  });
  
  squadPubgRouters.get("/getPlayerDate",(req,res)=>{
    let idPubg = req.query.idpubg;
    if(mongoose.connection.readyState == 1){
      squadPubgChampionship.aggregate([
        {
          $match:
            { 
              endDate:{ $eq: "no date added"}
            }
        },
        {
          $project:{
            _id:0,
            firstFilterSplitPlayers:{
              $cond: {
                if: {
                  $gt: [ {$size: { $ifNull: [ "$splitPlayers", [] ] }}, 0 ]
                },
                then:{
                  $slice: [ "$splitPlayers", -1 ]
                },
                else:[]
              }
            }
          }
        },
        {
          $unwind: {path: "$firstFilterSplitPlayers"}
        },
        {
          $project:{
            firstFilterSplitPlayers:1,
            secondFilterSplitPlayers:{
              $cond: {
                if: {
                    $eq: [ {$type: { $ifNull: [ "$firstFilterSplitPlayers", [] ] }}, "object" ],              
                },
                then:{
                  $filter: {
                    input: "$firstFilterSplitPlayers.data",
                    as: "filterData",
                    cond: { 
                      //$gt: [ {$size: { $ifNull: [ {"$$filterData.groupPlayers": { $elemMatch: { pubgId: idPubg } } }, [] ] }}, 0 ]
                      $or: [
                        {$in: [idPubg , "$$filterData.groupPlayers.pubgIdTeamLeader"]},
                        {$in: [idPubg , "$$filterData.groupPlayers.pubgIdFirstMember"]},
                        {$in: [idPubg , "$$filterData.groupPlayers.pubgIdSecondMember"]},
                        {$in: [idPubg , "$$filterData.groupPlayers.pubgIdThirdMember"]},
                      ]
                    }
                  }
                },
                else:[]
              }
            },
          }
        },
        {
          $project:{
            data:{
              $cond: {
                if: {
                  $gt: [ {$size: { $ifNull: [ "$secondFilterSplitPlayers", [] ] }}, 0 ]
                },
                then:{
                  date:"$secondFilterSplitPlayers.date",
                  time:"$secondFilterSplitPlayers.time",
                },
                else:{
                  date:[],
                  time:[]
                }
              }
            }
            
          }
        }
      ])
      .then(data => {
        let date  = {
          date : null,
          //day:null,
          time:null,
          message:null
        }
        if(data.length != 0 ){
          if(data[0].data.date.length != 0 /*&& data[0].data.day.length != 0*/ && data[0].data.time.length != 0)
          {
            date = {
              date: data[0].data.date[0],
              //day:"day : "+data[0].data.day[0],
              time: data[0].data.time[0],
              message:'your next round will start in'
            }
          }
          else{
            date  = {
              date : null,
              //day:null,
              time:null,
              message:'the idPubg not exist'
            }
          }
        }
        else{
          date  = {
            date : null,
            //day:null,
            time:null,
            message:'error occure please click on show date again'
          }
        }
        res.status(200).json(date);
      })
      .catch(error=>{
        console.log('error in getsquadplayerdate');
        console.log(error);
        let date  = {
          date : null,
          //day:null,
          time:null,
          message:'the idPubg not exist'
        }
        if(typeof squadSplitPlayers !== 'undefined' && squadSplitPlayers.length != 0)
        {
          for (let index = 0; index < squadSplitPlayers.length; index++) {
            const element = squadSplitPlayers[index];
            if(typeof element.groupPlayers !== 'undefined' && element.groupPlayers.filter(subElement => subElement.pubgIdTeamLeader == idPubg || subElement.pubgIdFirstMember == idPubg || subElement.pubgIdSecondMember == idPubg || subElement.pubgIdThirdMember == idPubg).length > 0)
            {
              date = {
                date:element.date,
                //day:element.day,
                time:element.time,
                message:'your next round will start in'
              }
              break;
            }
          }
        }
        else{
          date.message = 'error occure please refresh the page'
        }
        res.status(200).json(date);
      });
    }
    else{
      let date  = {
        date : null,
        //day:null,
        time:null,
        message:'the idPubg not exist'
      }
      if(typeof squadSplitPlayers !== 'undefined' && squadSplitPlayers.length != 0)
      {
        for (let index = 0; index < squadSplitPlayers.length; index++) {
          const element = squadSplitPlayers[index];
          if(typeof element.groupPlayers !== 'undefined' && element.groupPlayers.filter(subElement => subElement.pubgIdTeamLeader == idPubg || subElement.pubgIdFirstMember == idPubg || subElement.pubgIdSecondMember == idPubg || subElement.pubgIdThirdMember == idPubg).length > 0)
          {
            date = {
              date:element.date,
              //day:element.day,
              time:element.time,
              message:'your next round will start in'
            }
            break;
          }
        }
      }
      else{
        date.message = 'error occure please refresh the page'
      }
      res.status(200).json(date);
    }
  });
  squadPubgRouters.post("/freeAdGetAd", (req,res)=>{  //re mean register
    let country = undefined ;
    if(req.body.ip != undefined){
      country = geoip.lookup(req.body.ip).country;
    }
    if(mongoose.connection.readyState == 1){
      squadPubgChampionship.aggregate([
        {
          $match: { endDate: "no date added" }
        },
        {
          $lookup: {
            from: "paidads",
            localField: "paidAds._id",    // field in the orders collection
            foreignField: "_id",  // field in the items collection
            as: "paidVideos"
          }
        },
        {  
          $project : {
            _id:0,
            adsWillAppear:"$freeAds.adsWillAppear.videoId",
            freeAdResgister:{
              $cond: {
                if: {
                  $eq: [ "$registerFreeAdsType", true ]
                },
                then: true,
                else: false
              }
            },
            filterPaidads:{
              $cond: {
                if: {
                  $gt: [ {$size: { $ifNull: [ "$paidVideos", [] ] }}, 0 ]
                },
                then:{
                  $filter: {
                    input: "$paidVideos",
                    as: "paidVideo",
                    cond: { 
                      $and: [
                        { 
                          $gt: [ "$$paidVideo.totalViews", "$$paidVideo.viewsNumber" ]
                        },
                        { 
                          $or: [
                            { $eq: [ "$$paidVideo.adAppearanceCountry" ,"ALL" ]},
                            { $eq: [ "$$paidVideo.adAppearanceCountry",  country ] } 
                          ]  
                        },
                      ]
                    }
                }
                },
                else:[]
              }
            },
            filterfreeads:{
              $cond: {
                if: {
                  $gt: [ {$size: { $ifNull: [ "$freeAds.adsWillAppear", [] ] }}, 0 ]
                },
                then:{
                  $filter: {
                    input: "$freeAds.adsWillAppear",
                    as: "freeAd",
                    cond: { 
                      $or: [
                        { $eq: [ "$$freeAd.adAppearanceCountry" ,"ALL" ]},
                        { $eq: [ "$$freeAd.adAppearanceCountry",  country ] } 
                      ] 
                    }
                }
                },
                else:[]
              }
            },
            filtercharityads:{
              $cond: {
                if: {
                  $gt: [ {$size: { $ifNull: [ "$charityAds", [] ] }}, 0 ]
                },
                then:{
                  $filter: {
                    input: "$charityAds",
                    as: "charityAd",
                    cond: { 
                      $or: [
                        { $eq: [ "$$charityAd.adAppearanceCountry" ,"ALL" ]},
                        { $eq: [ "$$charityAd.adAppearanceCountry",  country ] } 
                      ] 
                    }
                }
                },
                else:[]
              }
            }
          }
          
        },
        {
          $project : {
            freeAdResgister:1,
            adsWillAppear:1,
            ads:{
              $cond: {
                if: {
                  $gt: [ {$size:"$filterPaidads"}, 0 ],
                },
                then: {
                  videoId : "$filterPaidads.videoId",
                  videoType:"paid",
                  adAppearanceCountry:"$filterPaidads.adAppearanceCountry"
                },
                else: {
                  $cond: {
                    if:{
                      $gt: [ {$size: { $ifNull: [ "$filterfreeads", [] ] }}, 0 ]
                    },
                    then: {
                      videoId:"$filterfreeads.videoId",
                      videoType:"free",
                      adAppearanceCountry:"$filterfreeads.adAppearanceCountry"
                    },
                    else:{
                      videoId:"$filtercharityads.videoId",
                      videoType:"charity",
                      adAppearanceCountry:"$filtercharityads.adAppearanceCountry"
                    }
                  }
                }
              }
            },
          }
        }
      ]).then(data =>{
        let sendData = {
          freeAdResgister : false,
          videoId : null,
          videoType : null,
          adAppearanceCountry:null,
          adsWillAppear:[],
        };
        if(data.length != 0){
          let randomIndex = Math.floor(Math.random()*data[0].ads.videoId.length)
          sendData.freeAdResgister = data[0].freeAdResgister;
          sendData.videoId = data[0].ads.videoId[randomIndex];
          sendData.videoType = data[0].ads.videoType;
          sendData.adAppearanceCountry = data[0].ads.adAppearanceCountry[randomIndex];
          sendData.adsWillAppear = data[0].adsWillAppear;
        }
        else{
          let tempData = squadGetAdNoConnect(country);
          sendData.videoId = tempData.videoId;
          sendData.videoType = tempData.videoType;
          sendData.adAppearanceCountry = tempData.adAppearanceCountry;
        }
        res.status(200).json(sendData);
      })
      .catch(error => {
        console.log('error in squadfreeadgetad');
        console.log(error);
        let tempData = squadGetAdNoConnect(country);
        let sendData = {
          freeAdResgister : false,
          videoId : tempData.videoId,
          videoType : tempData.videoType,
          adAppearanceCountry:tempData.adAppearanceCountry,
          adsWillAppear:[]
        }
        if(typeof squadFreeAds !== 'undefined')
        {
          let freeAdsWillAppear = [];
          let freeAdValues = Object.values(squadFreeAds);
          for (let index = 0; index < freeAdValues.length; index++) {
            for (let subindex = 0; subindex < freeAdValues[index].length; subindex++) {
              freeAdsWillAppear.push(freeAdValues[index][subindex]);
            }
          }
          sendData.adsWillAppear = freeAdsWillAppear;
        }
        res.status(200).json(sendData);
      });
    }
    else{
      let tempData = squadGetAdNoConnect(country);
      let sendData = {
        freeAdResgister : false,
        videoId : tempData.videoId,
        videoType : tempData.videoType,
        adAppearanceCountry:tempData.adAppearanceCountry,
        adsWillAppear:[]
      }
      if(typeof squadFreeAds !== 'undefined')
      {
        let freeAdsWillAppear = [];
        let freeAdValues = Object.values(squadFreeAds);
        for (let index = 0; index < freeAdValues.length; index++) {
          for (let subindex = 0; subindex < freeAdValues[index].length; subindex++) {
            freeAdsWillAppear.push(freeAdValues[index][subindex]);
          }
        }
        sendData.adsWillAppear = freeAdsWillAppear;
      }
      res.status(200).json(sendData);   
    }
  });
  /*app.get("/api/checksquadusernamefreead",(req,res)=>{
    let userName = req.query.username;
    squadPubgChampionship.aggregate([
      {
        $match:
          { 
            $and:
            [
              {endDate:"no date added"},
              {"freeAds.registers.userName": userName}
            ]
          }
      },
      {
        $project:{
          _id:0,
          registerFreeAdsType:1
        }
      }
    ]).then(data => {
      if(data.length == 0 ){
        res.status(200).json({acceptData:true,error:false,oldUserName:userName});
      }else{
        res.status(200).json({acceptData:false,error:false,oldUserName:userName});
      }
    })
    .catch(error=>{console.log("error in checksquadusernamefreead");console.log(error); res.status(200).json({acceptData:false,error:true,oldUserName:userName});});
  });*/
  squadPubgRouters.get("/checkGmailAccountFreeAd",(req,res)=>{
    let gmailaccount = req.query.gmailaccount;
    squadPubgChampionship.aggregate([
      { 
        $match:
          { $and:
            [
              {endDate:{ $eq: "no date added"}},
              {"freeAds.registers.email": gmailaccount}
            ]
          }
      },
      {
        $project:{
          _id:0,
          registerFreeAdsType:1
        }
      }
    ]).then(data => {
      if(data.length == 0 ){
        res.status(200).json({acceptData:true,error:false,oldGmail:gmailaccount});
      }else{
        res.status(200).json({acceptData:false,error:false,oldGmail:gmailaccount});
      }
    })
    .catch(error=>{console.log("error in checksquadgmailaccountfreead");console.log(error); res.status(200).json({acceptData:false,error:true,oldGmail:gmailaccount});});
  });
  squadPubgRouters.get("/checkYoutubeFreeAd",(req,res)=>{
    let youtube = req.query.youtube;
    squadPubgChampionship.aggregate([
      {
        $match:
          { $and:
            [
              {endDate:{ $eq: "no date added"}},
              {"freeAds.registers.videoId": youtube}
            ]
          }
      },
      {
        $project:{
          _id:0,
          registerFreeAdsType:1
        }
      }
    ]).then(data => {
      if(data.length == 0 ){
        res.status(200).json({acceptData:true,error:false,oldYoutube:youtube});
      }else{
        res.status(200).json({acceptData:false,error:false,oldYoutube:youtube});
      }
    })
    .catch(error=>{console.log("error in checksquadyoutubefreead");console.log(error); res.status(200).json({acceptData:false,error:true,oldYoutube:youtube});});
  });
  squadPubgRouters.post("/sendDataFreeAd",(req ,res)=>{
    squadPubgChampionship.findOneAndUpdate(
      {
        endDate:"no date added",
       /*"freeAds.registers.userName": { $not: { $in: [req.body.userName] } },*/
       "freeAds.registers.email": { $not: { $in: [req.body.email] } },
       "freeAds.registers.videoId": { $not: { $in: [req.body.Youtube] } },
      },
      {
        $push: { "freeAds.registers": { $each: [ {email : req.body.email , videoId : req.body.Youtube, adAppearanceCountry:req.body.Country , displayedAd : req.body.videoId} ] } }
      },
      {
        runValidators: true,
        projection: { "_id" : 0, "registerFreeAdsType" : 1 }
      }
    ).then(data=>{
      if(data != null && data.registerFreeAdsType){
        res.status(201).json({message:"your Registration in Free Ad is done"});
      }
      else{
        console.log('error in squad SendData in findOneAndUpdate in nModified');
        res.status(201).json({message:"an error occur please register again"});
      }
    })
    .catch(error=>{console.log('error in squad SendData in findOneAndUpdate');console.log(error);;res.status(201).json({message:"error because overloads of server. register after some minutes when overloads of server go down"});});
  }); 
  
  squadPubgRouters.get("/reportHackerRegister", (req,res)=>{  //re mean register
    if(mongoose.connection.readyState == 1){
      squadPubgChampionship.aggregate([
        {
          $match: { endDate: "no date added" }
        },
        {
          $project:{
            _id:0,
            reportHackerResgister:{
              $cond: {
                if: {
                  $eq: [ "$registerReportHackerType", true ]
                },
                then: true,
                else: false
              }
            },
            apperHackerAndWinners:{
              $cond: {
                if: {
                  $eq: [ "$appearHackerAndWinnersPubg", true ]
                },
                then: true,
                else: false
              }
            }   
          }
        }
      ]).then(data =>{
        let sendData = {
          reportHackerResgister : false,
          apperHackerAndWinners : false,
        };
        if(data.length != 0){
          sendData.reportHackerResgister = data[0].reportHackerResgister;
          sendData.apperHackerAndWinners = data[0].apperHackerAndWinners;
        }
        else{
          sendData.apperHackerAndWinners = squadApperHackerAndWinners;
        }
        res.status(200).json(sendData);
      })
      .catch(error => {
        console.log('error in squadreporthackerregister');
        console.log(error);
        let sendData = {
          reportHackerResgister : false,
          apperHackerAndWinners : squadApperHackerAndWinners,
        };
        res.status(200).json(sendData);
      });
    }
    else{
      let sendData = {
        reportHackerResgister : false,
        apperHackerAndWinners : squadApperHackerAndWinners,
      };
      res.status(200).json(sendData);   
    }
  });
  
  squadPubgRouters.get("/checkGmailAccountHacker",(req,res)=>{
    let gmailaccount = req.query.gmailaccount;
    squadPubgChampionship.aggregate([
      { 
        $match:
          { $and:
            [
              {endDate:{ $eq: "no date added"}},
              {"registerHacker.email": gmailaccount}
            ]
          }
      },
      {
        $project:{
          _id:0,
          registerReportHackerType:1
        }
      }
    ]).then(data => {
      if(data.length == 0 ){
        res.status(200).json({acceptData:true,error:false,oldGmail:gmailaccount});
      }else{
        res.status(200).json({acceptData:false,error:false,oldGmail:gmailaccount});
      }
    })
    .catch(error=>{console.log("error in checksquadgmailaccounthacker");console.log(error); res.status(200).json({acceptData:false,error:true,oldGmail:gmailaccount});});
  });
  
  squadPubgRouters.get("/checkGoogleDriveHacker",(req,res)=>{
    let googleDrive = req.query.googledrive;
    squadPubgChampionship.aggregate([
      {
        $match:
          { $and:
            [
              {endDate:{ $eq: "no date added"}},
              {"registerHacker.driveId": googleDrive}
            ]
          }
      },
      {
        $project:{
          _id:0,
          registerReportHackerType:1
        }
      }
    ]).then(data => {
      if(data.length == 0 ){
        res.status(200).json({acceptData:true,error:false,oldGoogleDrive:googleDrive});
      }else{
        res.status(200).json({acceptData:false,error:false,oldGoogleDrive:googleDrive});
      }
    })
    .catch(error=>{console.log("error in checksquadgoogledrivehacker");console.log(error); res.status(200).json({acceptData:false,error:true,oldGoogleDrive:googleDrive});});
  });
  
  squadPubgRouters.post("/sendDataHacker",(req ,res)=>{
    squadPubgChampionship.findOneAndUpdate(
      {
        endDate:"no date added",
       /*"freeAds.registers.userName": { $not: { $in: [req.body.userName] } },*/
       "registerHacker.email": { $not: { $in: [req.body.email] } },
       "registerHacker.driveId": { $not: { $in: [req.body.googleDrive] } },
      },
      {
        $push: { "registerHacker": { $each: [ {email : req.body.email , driveId : req.body.googleDrive} ] } }
      },
      {
        runValidators: true,
        projection: { "_id" : 0, "registerReportHackerType" : 1 }
      }
    ).then(data=>{
      if(data != null && data.registerReportHackerType){
        res.status(201).json({message:"your Registration in report hacker is done"});
      }
      else{
        console.log('error in squad SendDataHacker in findOneAndUpdate in nModified');
        res.status(201).json({message:"an error occur please register again"});
      }
    })
    .catch(error=>{console.log('error in squad SendDataHacker in findOneAndUpdate');console.log(error);;res.status(201).json({message:"error because overloads of server. register after some minutes when overloads of server go down"});});
  }); 
  
  squadPubgRouters.get("/getPlayerState",(req,res)=>{
    let idPubg = req.query.idpubg;
    if(mongoose.connection.readyState == 1){
      squadPubgChampionship.aggregate([
        {
          $match:
            { 
              endDate:{ $eq: "no date added"}
            }
        },
        {
          $project:{
            _id:0,
            firstFilterHackerAndWinner:{
              $cond: {
                if: {
                  $gt: [ {$size: { $ifNull: [ "$realHackerAndWinnersPubg", [] ] }}, 0 ]
                },
                then:{
                  $slice: [ "$realHackerAndWinnersPubg", -1 ]
                },
                else:[]
              }
            }
          }
        },
        {
          $unwind: {path: "$firstFilterHackerAndWinner"}
        },
        {
          $project:{
            message:{
              $cond: {
                if: {
                  $in: [ idPubg, "$firstFilterHackerAndWinner.realHacker.hackerPubgId"]
                },
                then:'you used hacker in last round'
                ,
                else:{
                  $cond: {
                    if: {
                      $in: [ idPubg, "$firstFilterHackerAndWinner.winnersPubgId"]
                    },
                    then:'Congratulations you are the winner in your group'
                    ,
                    else:'sorry you are not the winner in your group'
                  }
                }
              }
            }
          }
        }
      ])
      .then(data => {
        let message  = "sorry you are not the winner in your group";
        if(data.length != 0 ){
          message = data[0].message;
        }
        else{
          if( typeof squadReportHacke !== 'undefined' && squadReportHacke.length != 0 && 
              typeof squadWinnersPubg !== 'undefined' && squadWinnersPubg.length != 0
            )
          {
            if(squadReportHacke.includes(idPubg))
            {
              message = 'you use hacker in last round';
            }
            else if(message == 'sorry you are not the winner in your group' && squadWinnersPubg.includes(idPubg))
            {
              message = 'Congratulations you are the winner in your group';
            }
          }
          else{
            message = 'error occure please refresh the page'
          }
        }
        res.status(200).json(message);
      })
      .catch(error=>{
        console.log('error in getsquadplayerstate');
        console.log(error);
        let message  = "sorry you are not the winner in your group";
        if( typeof squadReportHacke !== 'undefined' && squadReportHacke.length != 0 && 
              typeof squadWinnersPubg !== 'undefined' && squadWinnersPubg.length != 0
            )
          {
            if(squadReportHacke.includes(idPubg))
            {
              message = 'you use hacker in last round';
            }
            else if(message == 'sorry you are not the winner in your group' && squadWinnersPubg.includes(idPubg))
            {
              message = 'Congratulations you are the winner in your group';
            }
          }
        else{
          message = 'error occure please refresh the page'
        }
        res.status(200).json(message);
      });
    }
    else{
      let message  = "sorry you are not the winner in your group";
      if( typeof squadReportHacke !== 'undefined' && squadReportHacke.length != 0 && 
            typeof squadWinnersPubg !== 'undefined' && squadWinnersPubg.length != 0
          )
        {
          if(squadReportHacke.includes(idPubg))
          {
            message = 'you use hacker in last round';
          }
          else if(message == 'sorry you are not the winner in your group' && squadWinnersPubg.includes(idPubg))
          {
            message = 'Congratulations you are the winner in your group';
          }
        }
      else{
        message = 'error occure please refresh the page';
      }
      res.status(200).json(message);
    }
  });














































































































  
  squadPubgRouters.get("/getPagesState" ,checkAuth, (req,res)=>{
    squadPubgChampionship.findOne(
        { endDate: 'no date added' },
        {   _id: 0, 
            registerTeamLeaderChampionshipType: 1, 
            registerMemberChampionshipType: 1, 
            registerFreeAdsType: 1 , 
            registerReportHackerType:1,
            appearHackerAndWinnersPubg:1,
            splitPlayersType:1
        }
    ).then(data => {
        if(data == null ){
          res.status(200).json({
                exist:false,
                error:false,
                registerTeamLeaderChampionshipType:false,
                registerMemberChampionshipType:false,
                registerFreeAdsType:false,
                registerReportHackerType:false,
                appearHackerAndWinnersPubg:false,
                splitPlayersType:false
          });
        }else{
            res.status(200).json({
                exist:true,
                error:false,
                registerTeamLeaderChampionshipType:data.registerTeamLeaderChampionshipType,
                registerMemberChampionshipType:data.registerMemberChampionshipType,
                registerFreeAdsType:data.registerFreeAdsType,
                registerReportHackerType:data.registerReportHackerType,
                appearHackerAndWinnersPubg:data.appearHackerAndWinnersPubg,
                splitPlayersType:data.splitPlayersType
            });
        }
      })
    .catch(error=>{console.log("error in squad admin getPagesState");console.log(error); 
        res.status(200).json({
            exist:false,
            error:true,
            registerTeamLeaderChampionshipType:false,
            registerMemberChampionshipType:false,
            registerFreeAdsType:false,
            registerReportHackerType:false,
            appearHackerAndWinnersPubg:false,
            splitPlayersType:false
        });
    });
  });
  
  squadPubgRouters.get("/registerTeamLeaderTrue" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
                message:"no change added"
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
                message:"no change added"
            });
        }
        else{
          squadPubgChampionship.findOneAndUpdate(
                {
                  endDate:"no date added",
                },
                {
                    $set: { registerTeamLeaderChampionshipType : true}
                },
                {
                  runValidators: true,
                  projection: { "_id" : 0, "registerTeamLeaderChampionshipType" : 1 }
                }
              ).then(data=>{
                if(data != null){
                    res.status(200).json({
                        message:"data change successfuly"
                    });                
                }
                else{
                    res.status(200).json({
                        message:"no change added"
                    });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in registerTeamLeaderTrue');
                    console.log(error);
                    res.status(201).json({message:"error occure try again"});
            });
        }
    })
    .catch(error =>{
        console.log("error in admin in squad registerTeamLeaderTrue");
        console.log(error);
        res.status(201).json({
            message:"error occure try again"
        });
    })
  });
  
  squadPubgRouters.get("/registerMemberTrue" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
                message:"no change added"
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
                message:"no change added"
            });
        }
        else{
          squadPubgChampionship.findOneAndUpdate(
                {
                  endDate:"no date added",
                },
                {
                    $set: { registerMemberChampionshipType : true}
                },
                {
                  runValidators: true,
                  projection: { "_id" : 0, "registerMemberChampionshipType" : 1 }
                }
              ).then(data=>{
                if(data != null){
                    res.status(200).json({
                        message:"data change successfuly"
                    });                
                }
                else{
                    res.status(200).json({
                        message:"no change added"
                    });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in registerMemberTrue');
                    console.log(error);
                    res.status(201).json({message:"error occure try again"});
            });
        }
    })
    .catch(error =>{
        console.log("error in admin in squad registerMemberTrue");
        console.log(error);
        res.status(201).json({
            message:"error occure try again"
        });
    })
  });
  
  squadPubgRouters.get("/setFreeAdsTypeTrue" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
                message:"no change added"
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
                message:"no change added"
            });
        }
        else{
          squadPubgChampionship.findOneAndUpdate(
                {
                  endDate:"no date added",
                },
                {
                    $set: { registerFreeAdsType : true}
                },
                {
                  runValidators: true,
                  projection: { "_id" : 0, "registerFreeAdsType" : 1 }
                }
              ).then(data=>{
                if(data != null){
                    res.status(200).json({
                        message:"data change successfuly"
                    });                
                }
                else{
                    res.status(200).json({
                        message:"no change added"
                    });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in registerFreeAdsType');console.log(error);
                res.status(201).json({message:"error occure try again"});
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in registerFreeAdsType");
        console.log(error);
        res.status(201).json({
            message:"error occure try again"
        });
    })
  });
  
  squadPubgRouters.get("/setReportHackerTypeTrue" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
                message:"no change added"
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
                message:"no change added"
            });
        }
        else{
          squadPubgChampionship.findOneAndUpdate(
                {
                  endDate:"no date added",
                },
                {
                    $set: { registerReportHackerType : true}
                },
                {
                  runValidators: true,
                  projection: { "_id" : 0, "registerReportHackerType" : 1 }
                }
              ).then(data=>{
                if(data != null){
                    res.status(200).json({
                        message:"data change successfuly"
                    });                
                }
                else{
                    res.status(200).json({
                        message:"no change added"
                    });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in registerReportHackerType');console.log(error);
                res.status(201).json({message:"error occure try again"});
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in registerReportHackerType");
        console.log(error);
        res.status(201).json({
            message:"error occure try again"
        });
    })
  });
  
  squadPubgRouters.get("/setAppearHackerAndWinnersTrue" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
                message:"no change added"
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
                message:"no change added"
            });
        }
        else{
          squadPubgChampionship.findOneAndUpdate(
                {
                  endDate:"no date added",
                },
                {
                    $set: { appearHackerAndWinnersPubg : true}
                },
                {
                  runValidators: true,
                  projection: { "_id" : 0, "appearHackerAndWinnersPubg" : 1 }
                }
              ).then(data=>{
                if(data != null){
                  squadApperHackerAndWinners = true;
                  res.status(200).json({
                      message:"data change successfuly"
                  });                
                }
                else{
                    res.status(200).json({
                        message:"no change added"
                    });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in appearHackerAndWinnersPubgTrue');console.log(error);
                res.status(201).json({message:"error occure try again"});
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in appearHackerAndWinnersPubgTrue");
        console.log(error);
        res.status(201).json({
            message:"error occure try again"
        });
    })
  });
  
  squadPubgRouters.get("/setSplitPlayersTypeTrue" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
                message:"no change added"
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
                message:"no change added"
            });
        }
        else{
          squadPubgChampionship.findOneAndUpdate(
                {
                  endDate:"no date added",
                },
                {
                    $set: { splitPlayersType : true}
                },
                {
                  runValidators: true,
                  projection: { "_id" : 0, "splitPlayersType" : 1 }
                }
              ).then(data=>{
                if(data != null){
                    res.status(200).json({
                        message:"data change successfuly"
                    });                
                }
                else{
                    res.status(200).json({
                        message:"no change added"
                    });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in splitPlayersTypeTrue');console.log(error);
                res.status(201).json({message:"error occure try again"});
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in splitPlayersTypeTrue");
        console.log(error);
        res.status(201).json({
            message:"error occure try again"
        });
    })
  });
  
  squadPubgRouters.get("/registerTeamLeaderFalse" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
                message:"no change added"
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
                message:"no change added"
            });
        }
        else{
          squadPubgChampionship.findOneAndUpdate(
                {
                  endDate:"no date added",
                },
                {
                    $set: { registerTeamLeaderChampionshipType : false}
                },
                {
                  runValidators: true,
                  projection: { "_id" : 0, "registerTeamLeaderChampionshipType" : 1 }
                }
              ).then(data=>{
                if(data != null){
                    res.status(200).json({
                        message:"data change successfuly"
                    });                
                }
                else{
                    res.status(200).json({
                        message:"no change added"
                    });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in registerTeamLeaderFalse');
                    console.log(error);
                    res.status(201).json({message:"error occure try again"});
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in registerTeamLeaderFalse");
        console.log(error);
        res.status(201).json({
            message:"error occure try again"
        });
    })
  });
  
  squadPubgRouters.get("/registerMemberFalse" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
                message:"no change added"
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
                message:"no change added"
            });
        }
        else{
          squadPubgChampionship.findOneAndUpdate(
                {
                  endDate:"no date added",
                },
                {
                    $set: { registerMemberChampionshipType : false}
                },
                {
                  runValidators: true,
                  projection: { "_id" : 0, "registerMemberChampionshipType" : 1 }
                }
              ).then(data=>{
                if(data != null){
                    res.status(200).json({
                        message:"data change successfuly"
                    });                
                }
                else{
                    res.status(200).json({
                        message:"no change added"
                    });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in registerMemberFalse');
                    console.log(error);
                    res.status(201).json({message:"error occure try again"});
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in registerMemberFalse");
        console.log(error);
        res.status(201).json({
            message:"error occure try again"
        });
    })
  });
  
  squadPubgRouters.get("/setFreeAdsTypeFalse" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
                message:"no change added"
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
                message:"no change added"
            });
        }
        else{
          squadPubgChampionship.findOneAndUpdate(
                {
                  endDate:"no date added",
                },
                {
                    $set: { registerFreeAdsType : false}
                },
                {
                  runValidators: true,
                  projection: { "_id" : 0, "registerFreeAdsType" : 1 }
                }
              ).then(data=>{
                if(data != null){
                    res.status(200).json({
                        message:"data change successfuly"
                    });                
                }
                else{
                    res.status(200).json({
                        message:"no change added"
                    });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in registerFreeAdsTypeFalse');console.log(error);
                res.status(201).json({message:"error occure try again"});
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in registerFreeAdsTypeFalse");
        console.log(error);
        res.status(201).json({
            message:"error occure try again"
        });
    })
  });
  
  squadPubgRouters.get("/setReportHackerTypeFalse" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
                message:"no change added"
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
                message:"no change added"
            });
        }
        else{
          squadPubgChampionship.findOneAndUpdate(
                {
                  endDate:"no date added",
                },
                {
                    $set: { registerReportHackerType : false}
                },
                {
                  runValidators: true,
                  projection: { "_id" : 0, "registerReportHackerType" : 1 }
                }
              ).then(data=>{
                if(data != null){
                    res.status(200).json({
                        message:"data change successfuly"
                    });                
                }
                else{
                    res.status(200).json({
                        message:"no change added"
                    });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in registerReportHackerTypeFalse');console.log(error);
                res.status(201).json({message:"error occure try again"});
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in registerReportHackerTypeFalse");
        console.log(error);
        res.status(201).json({
            message:"error occure try again"
        });
    })
  });
  
  squadPubgRouters.get("/setAppearHackerAndWinnersFalse" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
                message:"no change added"
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
                message:"no change added"
            });
        }
        else{
          squadPubgChampionship.findOneAndUpdate(
                {
                  endDate:"no date added",
                },
                {
                    $set: { appearHackerAndWinnersPubg : false}
                },
                {
                  runValidators: true,
                  projection: { "_id" : 0, "appearHackerAndWinnersPubg" : 1 }
                }
              ).then(data=>{
                if(data != null){
                  squadApperHackerAndWinners = false;
                  res.status(200).json({
                      message:"data change successfuly"
                  });                
                }
                else{
                    res.status(200).json({
                        message:"no change added"
                    });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in appearHackerAndWinnersPubgFalse');console.log(error);
                res.status(201).json({message:"error occure try again"});
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in appearHackerAndWinnersPubgFalse");
        console.log(error);
        res.status(201).json({
            message:"error occure try again"
        });
    })
  });
  
  squadPubgRouters.get("/setSplitPlayersTypeFalse" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
                message:"no change added"
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
                message:"no change added"
            });
        }
        else{
          squadPubgChampionship.findOneAndUpdate(
                {
                  endDate:"no date added",
                },
                {
                    $set: { splitPlayersType : false}
                },
                {
                  runValidators: true,
                  projection: { "_id" : 0, "splitPlayersType" : 1 }
                }
              ).then(data=>{
                if(data != null){
                    res.status(200).json({
                        message:"data change successfuly"
                    });                
                }
                else{
                    res.status(200).json({
                        message:"no change added"
                    });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in splitPlayersTypeFalse');console.log(error);
                res.status(201).json({message:"error occure try again"});
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in splitPlayersTypeFalse");
        console.log(error);
        res.status(201).json({
            message:"error occure try again"
        });
    })
  });
  
  squadPubgRouters.post("/addChampion" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
                message:"no champion added"
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
                message:"no champion added"
            });
        }
        else{
            const addNewSquadChampion = new squadPubgChampionship({
                startDate:req.body.startDate,
                totalPlayersNumber:req.body.totalPlayersNumber,
            });
            addNewSquadChampion.save()
            .then(data=>{
                res.status(200).json({
                    message:"championship added successfuly"
                });
            })
            .catch(error=>{
                console.log("error in squad admin in addChampion in save method");
                console.log(error)
                res.status(201).json({
                    message:"error occur"
                });
            });            
        }
    })
    .catch(error =>{
        console.log("error in squad admin in addChampion");
        console.log(error);
        res.status(201).json({
            message:"error occur"
        });
    })
  });
  
  squadPubgRouters.post("/endChampion" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
                message:"error occur"
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
                message:"error occur"
            });
        }
        else{
          squadPubgChampionship.findOneAndUpdate(
                {
                  endDate:"no date added",
                },
                {
                    $set: { endDate : req.body.endDate}
                },
                {
                  runValidators: true,
                  projection: { "_id" : 0, "endDate" : 1 }
                }
              ).then(data=>{
                if(data != null){
                  res.status(200).json({
                      message:"end champion successfuly"
                  });                
                }
                else{
                  res.status(200).json({
                      message:"error occur"
                  });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in endChampion');console.log(error);
                res.status(201).json({message:"error occur"});
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in endChampion");
        console.log(error);
        res.status(201).json({
            message:"error occur"
        });
    })
  });
  
  squadPubgRouters.post("/addCharityAds" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
                message:"error occur"
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
                message:"error occur"
            });
        }
        else{
          let addCharityAds = req.body.charityAds;
          squadPubgChampionship.findOneAndUpdate(
                {
                  endDate:"no date added",
                },
                {
                    $set: { charityAds : addCharityAds}
                },
                {
                  runValidators: true,
                  projection: { "_id" : 0, "endDate" : 1 }
                }
              ).then(data=>{
                if(data != null){
                  let setCharityAds = {};
                  for (let index = 0; index < addCharityAds.length; index++) {
                    const element = addCharityAds[index];
                    if(setCharityAds.hasOwnProperty(element.adAppearanceCountry)){
                      setCharityAds[element.adAppearanceCountry].push(element.videoId)
                    }
                    else{
                      setCharityAds[element.adAppearanceCountry] = [element.videoId]
                    }
                  }
                  squadCharityAds = setCharityAds;
                  res.status(200).json({
                      message:"charity ads added successfuly"
                  });                
                }
                else{
                  res.status(200).json({
                      message:"error occur"
                  });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in addCharityAds');console.log(error);
                res.status(201).json({message:"error occur"});
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in addCharityAds");
        console.log(error);
        res.status(201).json({
            message:"error occur"
        });
    })
  });
  
  squadPubgRouters.get("/getCharityAds" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json([]);
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json([]);
        }
        else{
          squadPubgChampionship.findOne(
              { endDate: 'no date added' },
              {   _id: 0, 
                  charityAds: 1, 
              }
              ).then(data=>{
                if(data != null){
                    res.status(200).json(data.charityAds);              
                }
                else{
                    res.status(200).json([]);
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOne in getCharityAds');console.log(error);
                res.status(201).json([]);
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in getCharityAds");
        console.log(error);
        res.status(201).json([]);
    })
  });
  
  squadPubgRouters.get("/getCharityAdsServer" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
              ads:{}
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
              ads:{}
            });
        }
        else{
          res.status(200).json(squadCharityAds);
        }
    })
    .catch(error =>{
        console.log("error in squad admin in getCharityAdsServer");
        console.log(error);
        res.status(201).json({
          ads:{}
        });
    })
  });
  
  squadPubgRouters.get("/deleteCharityAds" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
                message:"error occur"
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
                message:"error occur"
            });
        }
        else{
          squadPubgChampionship.findOneAndUpdate(
                {
                  endDate:"no date added",
                },
                {
                    $set: { charityAds : []}
                },
                {
                  runValidators: true,
                  projection: { "_id" : 0, "endDate" : 1 }
                }
              ).then(data=>{
                if(data != null){
                  squadCharityAds = {};
                  res.status(200).json({
                      message:"delete ads successfuly"
                  });                
                }
                else{
                    res.status(200).json({
                        message:"error occur"
                    });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in deleteCharityAds');console.log(error);
                res.status(201).json({message:"error occur"});
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in deleteCharityAds");
        console.log(error);
        res.status(201).json({
            message:"error occur"
        });
    })
  });
  
  squadPubgRouters.get("/CharityAdsFromDatabaseToServer" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
              message:"error occur"
            });
        }
        else if(data[0].email == "noemail@email.com"){
          res.status(200).json({
            message:"error occur"
          });
        }
        else{
          squadPubgChampionship.findOne(
              { endDate: 'no date added' },
              {   _id: 0, 
                  charityAds: 1, 
              }
              ).then(data=>{
                if(data != null){
                  let setCharityAds = {};
                  let charityAdsData = data.charityAds;
                  for (let index = 0; index < charityAdsData.length; index++) {
                    const element = charityAdsData[index];
                    if(setCharityAds.hasOwnProperty(element.adAppearanceCountry)){
                      setCharityAds[element.adAppearanceCountry].push(element.videoId)
                    }
                    else{
                      setCharityAds[element.adAppearanceCountry] = [element.videoId]
                    }
                  }
                  squadCharityAds = setCharityAds;
                  res.status(200).json({
                    message:"data added to server successful"
                  });             
                }
                else{
                  res.status(200).json({
                    message:"error occur"
                  });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOne in charityAdsFromDatabaseToServer');console.log(error);
              res.status(200).json({
                message:"error occur"
              });
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in charityAdsFromDatabaseToServer");
        console.log(error);
        res.status(200).json({
          message:"error occur"
        });
    })
  });
  
  
  squadPubgRouters.post("/addPaidAdsToServer" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
                message:"error occur"
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
                message:"error occur"
            });
        }
        else{
            let paidAds = req.body.paidAds;
            for (let index = 0; index < paidAds.length; index++) {
              paidAds[index] = {_id : mongoose.Types.ObjectId(paidAds[index])} 
            }
            squadPubgChampionship.findOneAndUpdate(
                {
                  endDate:"no date added",
                },
                {
                  $set: { paidAds : paidAds }
                },
                {
                  runValidators: true,
                  projection: { "_id" : 0, "endDate" : 1 }
                }
              ).then(data=>{
                if(data != null){
                  res.status(200).json({
                      message:"add paid ads successfuly"
                  });                
                }
                else{
                    res.status(200).json({
                        message:"error occur"
                    });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in addPaidAdsToServer');console.log(error);
                res.status(201).json({message:"error occur"});
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in addPaidAdsToServer");
        console.log(error);
        res.status(201).json({
            message:"error occur"
        });
    })
  });
  
  
  squadPubgRouters.post("/addPaidAdToServer" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
              message:"error occur"
            });
        }
        else if(data[0].email == "noemail@email.com"){
          res.status(200).json({
            message:"error occur"
          });
        }
        else{
          squadPubgChampionship.findOneAndUpdate(
              {
                endDate:"no date added",
              },
              {
                $push: { paidAds: { $each: [ { _id : mongoose.Types.ObjectId(req.body.paidAd)} ] } }
              },
              {
                runValidators: true,
                projection: { "_id" : 0, "endDate" : 1 }
              }
              ).then(data=>{
                if(data!= null){
                  res.status(200).json({
                    message:"added paid ad successfuly"
                  });
                }
                else{
                  res.status(200).json({
                    message:"error occur"
                  });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in addPaidAdToServer');console.log(error);
              res.status(200).json({
                message:"error occur"
              });
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in addPaidAdToServer");
        console.log(error);
        res.status(200).json({
          message:"error occur"
        });
    })
  });
  
  squadPubgRouters.get("/getPaidAds" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json([]);
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json([]);
        }
        else{
            paidAds.find(
              { $expr: { $gt: [ "$totalViews" , "$viewsNumber" ] } },
              {   _id: 1 }
              ).then(data=>{
                if(data.length != 0){
                  res.status(200).json(data);              
                }
                else{
                    res.status(200).json([]);
                }
              })
              .catch(error=>{console.log('error in  squad admin in find in getPaidAds');console.log(error);
                res.status(201).json([]);
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in getPaidAds");
        console.log(error);
        res.status(201).json([]);
    })
  });
  
  squadPubgRouters.get("/getSquadPaidAds" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json([]);
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json([]);
        }
        else{
          squadPubgChampionship.findOne(
              { endDate: 'no date added' },
              { _id: 0, 
                paidAds: 1, 
              }
              ).then(data=>{
                if(data != null){
                  res.status(200).json(data.paidAds);              
                }
                else{
                    res.status(200).json([]);
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOne in getSquadPaidAds');console.log(error);
                res.status(201).json([]);
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in getSquadPaidAds");
        console.log(error);
        res.status(201).json([]);
    })
  });
  
  squadPubgRouters.get("/deletePaidAds" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
                message:"error occur"
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
                message:"error occur"
            });
        }
        else{
          squadPubgChampionship.findOneAndUpdate(
                {
                  endDate:"no date added",
                },
                {
                    $set: { paidAds : []}
                },
                {
                  runValidators: true,
                  projection: { "_id" : 0, "endDate" : 1 }
                }
              ).then(data=>{
                if(data != null){
                  res.status(200).json({
                      message:"paid ads deleted successfuly"
                  });                
                }
                else{
                  res.status(200).json({
                      message:"error occur"
                  });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in deletePaidAds');console.log(error);
                res.status(201).json({message:"error occur"});
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in deletePaidAds");
        console.log(error);
        res.status(201).json({
            message:"error occur"
        });
    })
  });
  
  squadPubgRouters.post("/deletePaidAd" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
                message:"error occur"
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
                message:"error occur"
            });
        }
        else{
          squadPubgChampionship.findOneAndUpdate(
              {
                endDate:"no date added",
              },
              { $pull: { paidAds: { _id: req.body.deletePaidAd} } },
              {
                projection: { "_id" : 0, "endDate" : 1 }
              }
              ).then(data=>{
                if(data != null){
                  res.status(200).json({
                      message:"paid ad deleted successfuly"
                  });                
                }
                else{
                  res.status(200).json({
                      message:"error occur"
                  });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in deletePaidAd');console.log(error);
                res.status(201).json({message:"error occur"});
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in deletePaidAd");
        console.log(error);
        res.status(201).json({
            message:"error occur"
        });
    })
  });
  
  squadPubgRouters.post("/addBlackList" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
                message:"error occur"
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
                message:"error occur"
            });
        }
        else{
          let addBlackList = req.body.blackList;
          squadPubgChampionship.findOneAndUpdate(
                {
                  endDate:"no date added",
                },
                {
                    $set: { blackList : addBlackList}
                },
                {
                  runValidators: true,
                  projection: { "_id" : 0, "endDate" : 1 }
                }
              ).then(data=>{
                if(data != null){
                  res.status(200).json({
                      message:"black list added successfuly"
                  });                
                }
                else{
                  res.status(200).json({
                      message:"error occur"
                  });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in addBlackList');console.log(error);
                res.status(201).json({message:"error occur"});
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in addBlackList");
        console.log(error);
        res.status(201).json({
            message:"error occur"
        });
    })
  });
  
  squadPubgRouters.get("/getBlackList" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json([]);
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json([]);
        }
        else{
          squadPubgChampionship.findOne(
              { endDate: 'no date added' },
              {   _id: 0, 
                  blackList: 1, 
              }
              ).then(data=>{
                if(data != null){
                    res.status(200).json(data.blackList);              
                }
                else{
                    res.status(200).json([]);
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOne in getBlackList');console.log(error);
                res.status(201).json([]);
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in getBlackList");
        console.log(error);
        res.status(201).json([]);
    })
  });
  
  
  squadPubgRouters.get("/deleteBlackList" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
                message:"error occur"
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
                message:"error occur"
            });
        }
        else{
          squadPubgChampionship.findOneAndUpdate(
                {
                  endDate:"no date added",
                },
                {
                    $set: { blackList : []}
                },
                {
                  runValidators: true,
                  projection: { "_id" : 0, "endDate" : 1 }
                }
              ).then(data=>{
                if(data != null){
                  res.status(200).json({
                      message:"delete black list successfuly"
                  });                
                }
                else{
                    res.status(200).json({
                        message:"error occur"
                    });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in deleteBlackList');console.log(error);
                res.status(201).json({message:"error occur"});
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in deleteBlackList");
        console.log(error);
        res.status(201).json({
            message:"error occur"
        });
    })
  });
  
  squadPubgRouters.get("/getRegisterAds" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json([]);
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json([]);
        }
        else{
          squadPubgChampionship.findOne(
            {
              endDate:"no date added",
            },
            {
              "_id" : 0,
              "freeAds.registers.videoId" : 1,
              "freeAds.registers.email" : 1,
              "freeAds.registers.adAppearanceCountry" : 1,
            }
            ).then(data=>{
                if(data != null){
                    res.status(200).json(data.freeAds.registers);              
                }
                else{
                    res.status(200).json([]);
                }
              })
              .catch(error=>{console.log('error in  squad admin in aggregate in getRegisterAds');console.log(error);
                res.status(201).json([]);
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in getRegisterAds");
        console.log(error);
        res.status(201).json([]);
    })
  });
  
  squadPubgRouters.post("/addFreeAdToServer" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
              message:"error occur"
            });
        }
        else if(data[0].email == "noemail@email.com"){
          res.status(200).json({
            message:"error occur"
          });
        }
        else{
          let videoId = req.body.videoId;
          let email = req.body.email ;
          let adCountry = req.body.adCountry;
          squadPubgChampionship.findOneAndUpdate(
              {
                endDate:"no date added",
              },
              {
                $push: { "freeAds.adsWillAppear": { $each: [ {videoId:videoId ,email:email ,adAppearanceCountry:adCountry} ] } }
              },
              {
                runValidators: true,
                projection: { "_id" : 0, "endDate" : 1 }
              }
              ).then(data=>{
                if(data!= null){
                  if(squadFreeAds.hasOwnProperty(adCountry)){
                    squadFreeAds[adCountry].push(videoId);
                  }
                  else{
                    squadFreeAds[adCountry] = [videoId];
                  }
                  res.status(200).json({
                    message:"added free ad successfuly"
                  });
                }
                else{
                  res.status(200).json({
                    message:"error occur"
                  });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in addFreeAdToServer');console.log(error);
              res.status(200).json({
                message:"error occur"
              });
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in addFreeAdToServer");
        console.log(error);
        res.status(200).json({
          message:"error occur"
        });
    })
  });
  
  squadPubgRouters.get("/getAdsWillAppear" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json([]);
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json([]);
        }
        else{
            let adsNumber = parseInt(req.query.adsnumber);
            squadPubgChampionship.aggregate([
              {
                $match:
                  { 
                    endDate:{ $eq: "no date added"}
                  }
              },
              {
                $project:{
                  _id:0,
                  "freeAds.registers.videoId":1,
                  "freeAds.registers.email":1,
                  "freeAds.registers.adAppearanceCountry":1
                }
              },
              {
                $unwind : "$freeAds.registers"
              },
              {
                $sample: { size: adsNumber }
              },
              {
                $project:{
                  videoId:"$freeAds.registers.videoId",
                  email:"$freeAds.registers.email",
                  adAppearanceCountry:"$freeAds.registers.adAppearanceCountry"
                }
              }]
              ).then(data=>{
                if(data.length != 0){
                    res.status(200).json(data);              
                }
                else{
                    res.status(200).json([]);
                }
              })
              .catch(error=>{console.log('error in  squad admin in aggregate in getAdsWillAppear');console.log(error);
                res.status(201).json([]);
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in getAdsWillAppear");
        console.log(error);
        res.status(201).json([]);
    })
  });
  
  
  squadPubgRouters.post("/addAdsWillAppear" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
                message:"error occur"
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
                message:"error occur"
            });
        }
        else{
            let adsAppear = req.body.ads;
            squadPubgChampionship.findOneAndUpdate(
                {
                  endDate:"no date added",
                },
                {
                  $set: { "freeAds.adsWillAppear": adsAppear }
                },
                {
                  runValidators: true,
                  projection: { "_id" : 0, "endDate" : 1 }
                }
              ).then(data=>{
                if(data != null){
                  let setFreeAds = {};
                  for (let index = 0; index < adsAppear.length; index++) {
                    const element = adsAppear[index];
                    if(setFreeAds.hasOwnProperty(element.adAppearanceCountry)){
                      setFreeAds[element.adAppearanceCountry].push(element.videoId)
                    }
                    else{
                      setFreeAds[element.adAppearanceCountry] = [element.videoId]
                    }
                  }
                  squadFreeAds = setFreeAds;
                  res.status(200).json({
                      message:"add ads successfuly"
                  });                
                }
                else{
                    res.status(200).json({
                        message:"error occur"
                    });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in addAdsWillAppear');console.log(error);
                res.status(201).json({message:"error occur"});
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in addAdsWillAppear");
        console.log(error);
        res.status(201).json({
            message:"error occur"
        });
    })
  });
  
  squadPubgRouters.get("/getRealAdsWillAppear" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json([]);
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json([]);
        }
        else{
          squadPubgChampionship.findOne(
              {
                endDate:"no date added",
              },
              {
                "_id" : 0,
                "freeAds.adsWillAppear" : 1 
              }
              ).then(data=>{
                if(data.length != 0){
                    res.status(200).json(data.freeAds.adsWillAppear);              
                }
                else{
                    res.status(200).json([]);
                }
              })
              .catch(error=>{console.log('error in  squad admin in aggregate in getRealAdsWillAppear');console.log(error);
                res.status(201).json([]);
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in getRealAdsWillAppear");
        console.log(error);
        res.status(201).json([]);
    })
  });
  
  squadPubgRouters.get("/getAdsWillAppearserver" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
              ads:{}
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
              ads:{}
            });
        }
        else{
          res.status(200).json(squadFreeAds);
        }
    })
    .catch(error =>{
        console.log("error in squad admin in getAdsWillAppearserver");
        console.log(error);
        res.status(201).json({
          ads:{}
        });
    })
  });
  
  squadPubgRouters.get("/deleteAdsWillAppear" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
                message:"error occur"
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
                message:"error occur"
            });
        }
        else{
          squadPubgChampionship.findOneAndUpdate(
                {
                  endDate:"no date added",
                },
                {
                    $set: { "freeAds.adsWillAppear" : []}
                },
                {
                  runValidators: true,
                  projection: { "_id" : 0, "endDate" : 1 }
                }
              ).then(data=>{
                if(data != null){
                  squadFreeAds = {};
                  res.status(200).json({
                      message:"delete ads successfuly"
                  });                
                }
                else{
                    res.status(200).json({
                        message:"error occur"
                    });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in deleteAdsWillAppear');console.log(error);
                res.status(201).json({message:"error occur"});
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in deleteAdsWillAppear");
        console.log(error);
        res.status(201).json({
            message:"error occur"
        });
    })
  });
  
  squadPubgRouters.post("/deleteFreeAd" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
                message:"error occur"
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
                message:"error occur"
            });
        }
        else{
          squadPubgChampionship.findOneAndUpdate(
              {
                endDate:"no date added",
              },
              { $pull: { "freeAds.adsWillAppear": { _id: req.body.deleteFreeAd} } },
              {
                returnOriginal : false,
                projection: { "_id" : 0, "freeAds.adsWillAppear" : 1 }
              }
              ).then(data=>{
                let adsWillAppearArray = data.freeAds.adsWillAppear;
                let setFreeAds = {};
                for (let index = 0; index < adsWillAppearArray.length; index++) {
                  const element = adsWillAppearArray[index];
                  if(setFreeAds.hasOwnProperty(element.adAppearanceCountry)){
                    setFreeAds[element.adAppearanceCountry].push(element.videoId)
                  }
                  else{
                    setFreeAds[element.adAppearanceCountry] = [element.videoId]
                  }
                }
                squadFreeAds = setFreeAds;
                if(data != null){
                  res.status(200).json({
                      message:"free ad deleted successfuly"
                  });                
                }
                else{
                  res.status(200).json({
                      message:"error occur"
                  });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in deleteFreeAd');console.log(error);
                res.status(201).json({message:"error occur"});
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in deleteFreeAd");
        console.log(error);
        res.status(201).json({
            message:"error occur"
        });
    })
  });
  
  squadPubgRouters.get("/adsFromDatabaseToServer" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
              message:"error occur"
            });
        }
        else if(data[0].email == "noemail@email.com"){
          res.status(200).json({
            message:"error occur"
          });
        }
        else{
          squadPubgChampionship.aggregate([
              {
                $match:
                  { 
                    endDate:{ $eq: "no date added"}
                  }
              },
              {
                $project:{
                  _id:0,
                  "freeAds.adsWillAppear.videoId":1,
                  "freeAds.adsWillAppear.email":1,
                  "freeAds.adsWillAppear.adAppearanceCountry":1
                }
              },
              {
                $unwind : "$freeAds.adsWillAppear"
              },
              {
                $project:{
                  videoId:"$freeAds.adsWillAppear.videoId",
                  email:"$freeAds.adsWillAppear.email",
                  adAppearanceCountry:"$freeAds.adsWillAppear.adAppearanceCountry"
                }
              }]
              ).then(data=>{
                if(data.length != 0){
                  let setFreeAds = {};
                  for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    if(setFreeAds.hasOwnProperty(element.adAppearanceCountry)){
                      setFreeAds[element.adAppearanceCountry].push(element.videoId)
                    }
                    else{
                      setFreeAds[element.adAppearanceCountry] = [element.videoId]
                    }
                  }
                  squadFreeAds = setFreeAds;
                  res.status(200).json({
                    message:"data added to server successful"
                  });             
                }
                else{
                  res.status(200).json({
                    message:"error occur"
                  });
                }
              })
              .catch(error=>{console.log('error in  squad admin in aggregate in adsFromDatabaseToServer');console.log(error);
              res.status(200).json({
                message:"error occur"
              });
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in adsFromDatabaseToServer");
        console.log(error);
        res.status(200).json({
          message:"error occur"
        });
    })
  });
  
  squadPubgRouters.post("/addPlayer" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
              message:"error occur"
            });
        }
        else if(data[0].email == "noemail@email.com"){
          res.status(200).json({
            message:"error occur"
          });
        }
        else{
            let pubgIdTeamLeader = req.body.pubgIdTeamLeader;
            let pubgIdFirstMember = req.body.pubgIdFirstMember;
            let pubgIdSecondMember = req.body.pubgIdSecondMember;
            let pubgIdThirdMember = req.body.pubgIdThirdMember;
            squadPubgChampionship.findOneAndUpdate(
              {
                endDate:"no date added",
              },
              {
                $push: { players: { $each: [ { 
                  emailTeamLeader:"playtogain2020@gmail.com", pubgIdTeamLeader:pubgIdTeamLeader , displayedAdTeamLeader:"adminData",
                  emailFirstMember:"playtogain2020@gmail.com", pubgIdFirstMember:pubgIdFirstMember , displayedAdFirstMember:"adminData", acceptFirstPlayer:true ,
                  emailSecondMember:"playtogain2020@gmail.com", pubgIdSecondMember:pubgIdSecondMember , displayedAdSecondMember:"adminData", acceptSecondPlayer:true ,
                  emailThirdMember:"playtogain2020@gmail.com", pubgIdThirdMember:pubgIdThirdMember , displayedAdThirdMember:"adminData" , acceptThirdPlayer:true
                } ] } }
              },
              {
                runValidators: true,
                projection: { "_id" : 0, "endDate" : 1 }
              }
              ).then(data=>{
                if(data!= null){
                  res.status(200).json({
                    message:"data added successfuly"
                  });
                }
                else{
                  res.status(200).json({
                    message:"error occur"
                  });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in addPlayer');console.log(error);
              res.status(200).json({
                message:"error occur"
              });
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in addPlayer");
        console.log(error);
        res.status(200).json({
          message:"error occur"
        });
    })
  });
  
  
  squadPubgRouters.get("/deletePlayer" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
              message:"error occur"
            });
        }
        else if(data[0].email == "noemail@email.com"){
          res.status(200).json({
            message:"error occur"
          });
        }
        else{
            let pubgId = req.query.pubgId;
            squadPubgChampionship.findOneAndUpdate(
              {
                endDate:"no date added",
              },
              { 
                $pull: { players: { $or: [
                  { pubgIdTeamLeader: pubgId },
                  { pubgIdFirstMember: pubgId },
                  { pubgIdSecondMember: pubgId },
                  { pubgIdThirdMember: pubgId } 
                ] } }
              },
              {
                projection: { "_id" : 0, "endDate" : 1 }
              }
              ).then(data=>{
                if(data!= null){
                  res.status(200).json({
                    message:"data deleted successfuly"
                  });
                }
                else{
                  res.status(200).json({
                    message:"error occur"
                  });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in deletePlayer');console.log(error);
              res.status(200).json({
                message:"error occur"
              });
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in deletePlayer");
        console.log(error);
        res.status(200).json({
          message:"error occur"
        });
    })
  });
  
  squadPubgRouters.get("/getPubgIds" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json([]);
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json([]);
        }
        else{
          squadPubgChampionship.aggregate([
            {
              $match:
                { 
                  endDate:{ $eq: "no date added"}
                }
            },
            {
              $project:{
                _id:0,
                playersData:{
                  $filter: {
                    input: "$players",
                    as: "players",
                    cond: {
                      $eq: [ "$$players.acceptFirstPlayer" ,true ],
                      $eq: [ "$$players.acceptSecondPlayer" ,true ],
                      $eq: [ "$$players.acceptThirdPlayer" ,true ],
                    }
                  }
                },
              }
            },
            {
              $project:{
                "playersData.pubgIdTeamLeader":1,
                "playersData.pubgIdFirstMember":1,
                "playersData.pubgIdSecondMember":1,
                "playersData.pubgIdThirdMember":1
              }
            }
            ]).then(data => {
            if(data.length != 0 ){
              res.status(200).json(data[0].playersData);
            }
            else{
              res.status(201).json([]);
            }
          })
          .catch(error=>{
            console.log('error in  squad admin in findOne in getPubgIds');console.log(error);
            res.status(201).json([]);
          });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in getPubgIds");
        console.log(error);
        res.status(201).json([]);
    })
  });
  
  squadPubgRouters.post("/splitPlayer" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
                message:"no split player added"
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
                message:"no split player added"
            });
        }
        else{
            let playersData = req.body.data;
            squadPubgChampionship.findOneAndUpdate(
                {
                  endDate:"no date added",
                },
                {
                  $push: { splitPlayers: { $each: [ { round : req.body.round , data : playersData } ] } }
                },
                {
                  runValidators: true,
                  projection: { "_id" : 0, "endDate" : 1 }
                }
              ).then(data=>{
                if(data != null){
                  squadSplitPlayers = [];
                  for (let index = 0; index < playersData.length; index++) {
                    let element = playersData[index];
                    let pubgIds = [];
                    let pubgIdArray = playersData[index].groupPlayers;
                    for (let subIndex = 0; subIndex < pubgIdArray.length; subIndex++) {
                      let subElement = pubgIdArray[subIndex];
                      pubgIds.push(subElement);
                    }
                    squadSplitPlayers.push({
                      date:element.date,
                      time:element.time,
                      groupPlayers:pubgIds
                    })
                  }
                  res.status(200).json({
                      message:"split player added successfuly"
                  });               
                }
                else{
                    res.status(200).json({
                        message:"no split player added"
                    });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in splitPlayer');console.log(error);
                res.status(201).json({message:"error occur"});
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in splitPlayer");
        console.log(error);
        res.status(201).json({
            message:"error occur"
        });
    })
  });
  
  squadPubgRouters.post("/addSubSplitPlayer" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
                message:"no split player added"
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
                message:"no split player added"
            });
        }
        else{
            let playersData = req.body.data;
            squadPubgChampionship.findOneAndUpdate(
                {
                  endDate:"no date added",
                },
                {
                  $push: { "splitPlayers.0.data": { $each:  playersData  } }
                },
                {
                  runValidators: true,
                  projection: { "_id" : 0, "endDate" : 1 }
                }
              ).then(data=>{
                if(data != null){
                  for (let index = 0; index < playersData.length; index++) {
                    let element = playersData[index];
                    let pubgIds = [];
                    let pubgIdArray = playersData[index].groupPlayers;
                    for (let subIndex = 0; subIndex < pubgIdArray.length; subIndex++) {
                      let subElement = pubgIdArray[subIndex];
                      pubgIds.push(subElement);
                    }
                    squadSplitPlayers.push({
                      date:element.date,
                      time:element.time,
                      groupPlayers:pubgIds
                    })
                  }
                  res.status(200).json({
                      message:"split player added successfuly"
                  });               
                }
                else{
                    res.status(200).json({
                        message:"no split player added"
                    });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in addSubSplitPlayer');console.log(error);
                res.status(201).json({message:"error occur"});
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in addSubSplitPlayer");
        console.log(error);
        res.status(201).json({
            message:"error occur"
        });
    })
  });
  
  squadPubgRouters.get("/getSplitPlayer" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({round:0,data:[]});
        }
        else if(data[0].email == "noemail@email.com"){
          res.status(200).json({round:0,data:[]});
        }
        else{
          squadPubgChampionship.aggregate([
            {
              $match:
                { 
                  endDate:{ $eq: "no date added"}
                }
            },
            {
              $project:{
                _id:0,
                lastIndexSplitPlayerPubg:{
                  $cond: {
                    if: {
                      $gt: [ {$size: { $ifNull: [ "$splitPlayers", [] ] }}, 0 ]
                    },
                    then:{
                      $slice: [ "$splitPlayers", -1 ]
                    },
                    else:[{round:0,data:[]}]
                  }
                }
              }
            },
            {
              $unwind: {path: "$lastIndexSplitPlayerPubg"}
            }]
            ).then(data=>{
              if(data.length != 0 ){
                  res.status(200).json(data[0].lastIndexSplitPlayerPubg);              
              }
              else{
                res.status(200).json({round:0,data:[]});
              }
            })
            .catch(error=>{console.log('error in  squad admin in aggregate in getSplitPlayer');console.log(error);
              res.status(200).json({round:0,data:[]});
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in getSplitPlayer");
        console.log(error);
        res.status(200).json({round:0,data:[]});
    })
  });
  
  squadPubgRouters.get("/getSplitPlayerNoConnect" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json([]);
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json([]);
        }
        else{
          res.status(200).json(squadSplitPlayers);
        }
    })
    .catch(error =>{
        console.log("error in squad admin in getSplitPlayerNoConnect");
        console.log(error);
        res.status(201).json([]);
    })
  });
  
  squadPubgRouters.get("/deleteSplitPlayers" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
                message:"error occur"
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
                message:"error occur"
            });
        }
        else{
          squadPubgChampionship.findOneAndUpdate(
                {
                  endDate:"no date added",
                },
                { 
                  $pop: { 
                    splitPlayers: 1 
                  } 
                },
                {
                  projection: { "_id" : 0, "endDate" : 1 }
                }
              ).then(data=>{
                if(data != null){
                  squadSplitPlayers = [];
                  res.status(200).json({
                      message:"delete splite players successfuly"
                  });                
                }
                else{
                    res.status(200).json({
                        message:"error occur"
                    });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in deleteSplitPlayers');console.log(error);
                res.status(201).json({message:"error occur"});
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in deleteSplitPlayers");
        console.log(error);
        res.status(201).json({
            message:"error occur"
        });
    })
  });
  
  squadPubgRouters.get("/sPFromDatabaseToServer" ,checkAuth, (req,res)=>{ //hAW mean hackers and winners
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
              message:"error occur"
            });
        }
        else if(data[0].email == "noemail@email.com"){
          res.status(200).json({
            message:"error occur"
          });
        }
        else{
          squadPubgChampionship.aggregate([
            {
              $match:
                { 
                  endDate:{ $eq: "no date added"}
                }
            },
            {
              $project:{
                _id:0,
                lastIndexSplitPlayersPubg:{
                  $cond: {
                    if: {
                      $gt: [ {$size: { $ifNull: [ "$splitPlayers", [] ] }}, 0 ]
                    },
                    then:{
                      $slice: [ "$splitPlayers", -1 ]
                    },
                    else:[]
                  }
                }
              }
            },
            {
              $unwind: {path: "$lastIndexSplitPlayersPubg"}
            },
            {
              $project:{
                splitPlayerData:"$lastIndexSplitPlayersPubg.data",
              }
            }]
            ).then(data=>{
              if(data.length != 0){
                let SplitPlayersServer = [];
                for (let index = 0; index < data[0].splitPlayerData.length; index++) {
                  const element = data[0].splitPlayerData[index];
                  let groupPlayers = [];
                  for (let subIndex = 0; subIndex < element.groupPlayers.length; subIndex++) {
                    const subElement = element.groupPlayers[subIndex];
                    groupPlayers.push({pubgIdTeamLeader:subElement.pubgIdTeamLeader , pubgIdFirstMember:subElement.pubgIdFirstMember , pubgIdSecondMember:subElement.pubgIdSecondMember , pubgIdThirdMember:subElement.pubgIdThirdMember});
                  }
                  SplitPlayersServer.push({
                    date:element.date,
                    time:element.time,
                    groupPlayers:groupPlayers
                  })
                }
                squadSplitPlayers = SplitPlayersServer;
                res.status(200).json({
                  message:"data added successfuly"
                });
              }
              else{
                res.status(200).json({
                  message:"error occur"
                });
              }
            })
            .catch(error=>{console.log('error in  squad admin in aggregate in sPFromDatabaseToServer');console.log(error);
            res.status(200).json({
              message:"error occur"
            });
          });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in sPFromDatabaseToServer");
        console.log(error);
        res.status(200).json({
          message:"error occur"
        });
    })
  });
  
  squadPubgRouters.get("/getLastHackersWinnersRound" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({round:0,realHacker:[] , winnersPubgId:[]});
        }
        else if(data[0].email == "noemail@email.com"){
          res.status(200).json({round:0,realHacker:[] , winnersPubgId:[]});
        }
        else{
          squadPubgChampionship.aggregate([
            {
              $match:
                { 
                  endDate:{ $eq: "no date added"}
                }
            },
            {
              $project:{
                _id:0,
                lastIndexWinnersHackers:{
                  $cond: {
                    if: {
                      $gt: [ {$size: { $ifNull: [ "$realHackerAndWinnersPubg", [] ] }}, 0 ]
                    },
                    then:{
                      $slice: [ "$realHackerAndWinnersPubg", -1 ]
                    },
                    else:[{round:0,realHacker:[] , winnersPubgId:[]}]
                  }
                }
              }
            },
            {
              $unwind: {path: "$lastIndexWinnersHackers"}
            }]
            ).then(data=>{
              if(data.length != 0 ){
                  res.status(200).json(data[0].lastIndexWinnersHackers);              
              }
              else{
                res.status(200).json({round:0,realHacker:[] , winnersPubgId:[]});
              }
            })
            .catch(error=>{console.log('error in  squad admin in aggregate in getLastHackersWinnersRound');console.log(error);
            res.status(200).json({round:0,realHacker:[] , winnersPubgId:[]});
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in getLastHackersWinnersRound");
        console.log(error);
        res.status(200).json({round:0,realHacker:[] , winnersPubgId:[]});
    })
  });
  
  squadPubgRouters.get("/getRegisterHackers" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json([]);
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json([]);
        }
        else{
          squadPubgChampionship.findOne(
              {
                endDate:"no date added",
              },
              {
                "_id" : 0, "registerHacker.driveId" : 1 
              }
              ).then(data=>{
                if(data != null ){
                    res.status(200).json(data.registerHacker);              
                }
                else{
                    res.status(200).json([]);
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOne in getRegisterHackers');console.log(error);
                res.status(201).json([]);
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in getRegisterHackers");
        console.log(error);
        res.status(201).json([]);
    })
  });
  
  squadPubgRouters.post("/getEmailHacker" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
              message:"error occur"
            });
        }
        else if(data[0].email == "noemail@email.com"){
          res.status(200).json({
            message:"error occur"
          });
        }
        else{
          let idPubg = req.body.idPubg;
          squadPubgChampionship.aggregate([
            {
              $match:
                { 
                  endDate:{ $eq: "no date added"}
                }
            },
            {
              $project:{
                _id:0,
                HackerData:{
                  $filter: {
                    input: "$players",
                    as: "players",
                    cond: {
                      $or: [
                        {$eq: [ "$$players.pubgIdTeamLeader" ,idPubg ]},
                        {$eq: [ "$$players.pubgIdFirstMember" ,idPubg ]},
                        {$eq: [ "$$players.pubgIdSecondMember" ,idPubg ]},
                        {$eq: [ "$$players.pubgIdThirdMember" ,idPubg ]},
                      ]
                    }
                  }
                },
              }
            }
            ]).then(data=>{
              if(data.length != 0 && data[0].HackerData != 0){
                if(data[0].HackerData[0].pubgIdTeamLeader == idPubg){
                  res.status(200).json({
                    message:data[0].HackerData[0].emailTeamLeader
                  });
                }
                else if(data[0].HackerData[0].pubgIdFirstMember == idPubg){
                  res.status(200).json({
                    message:data[0].HackerData[0].emailFirstMember
                  });
                }
                else if(data[0].HackerData[0].pubgIdSecondMember == idPubg){
                  res.status(200).json({
                    message:data[0].HackerData[0].emailSecondMember
                  });
                }
                else if(data[0].HackerData[0].pubgIdThirdMember == idPubg){
                  res.status(200).json({
                    message:data[0].HackerData[0].emailThirdMember
                  });
                }
                else{
                  res.status(200).json({
                    message:"error occur"
                  });
                }
              }
              else{
                res.status(200).json({
                  message:"this id not exist in championship"
                });
              }
            })
            .catch(error=>{console.log('error in  squad admin in aggregate in getEmailHacker');console.log(error);
            res.status(200).json({
              message:"error occur"
            });
          });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in getEmailHacker");
        console.log(error);
        res.status(200).json({
          message:"error occur"
        });
    })
  });
  
  squadPubgRouters.post("/addHackersAndWinners" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
              message:"error occur",
              indexHackerAndWinnersPubg:0
            });
        }
        else if(data[0].email == "noemail@email.com"){
          res.status(200).json({
            message:"error occur",
            indexHackerAndWinnersPubg:0
          });
        }
        else{console.log("llll"); console.log(req.socket.bytesRead);
          let hackersAndWinnersData = req.body.data;
          squadPubgChampionship.findOneAndUpdate(
            {
              endDate:"no date added",
            },
            {
                $push: { realHackerAndWinnersPubg: { $each: [hackersAndWinnersData] } }
            },
            {
              runValidators: true,
              projection: { "_id" : 0, "realHackerAndWinnersPubg.round":1 }
            }).then(data=>{
              if(data != null){
                let hackers = [];
                let indexHackerAndWinnersPubg = data.realHackerAndWinnersPubg.length;
                for (let index = 0; index < hackersAndWinnersData.realHacker.length; index++) {
                  const element = hackersAndWinnersData.realHacker[index];
                  hackers.push(element.hackerPubgId);
                }
                squadReportHacke = hackers;
                squadWinnersPubg = hackersAndWinnersData.winnersPubgId;
                res.status(200).json({
                  message:"data added successfuly",
                  indexHackerAndWinnersPubg:indexHackerAndWinnersPubg
                });
              }
              else{
                res.status(200).json({
                  message:"error occur",
                  indexHackerAndWinnersPubg:0
                });
              }
            })
            .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in addHackersAndWinners');console.log(error);
            res.status(200).json({
              message:"error occur",
              indexHackerAndWinnersPubg:0
            });
          });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in addHackersAndWinners");
        console.log(error);
        res.status(200).json({
          message:"error occur",
          indexHackerAndWinnersPubg:0
        });
    })
  });
  
  squadPubgRouters.post("/addSubHackersAndWinners" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
                message:"error occur"
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
                message:"error occur"
            });
        }
        else{console.log(req.socket.bytesRead);
            let hackersData = req.body.hackersData;
            let winnerPubgIdData = req.body.winnerPubgIdData;
            let index = req.body.index;
            let updateQueryHackers = "realHackerAndWinnersPubg." + index + ".realHacker";
            let updateQueryWinners = "realHackerAndWinnersPubg." + index + ".winnersPubgId";
            let dataLastIndex = {}
            dataLastIndex[updateQueryHackers] = hackersData;
            dataLastIndex[updateQueryWinners] = winnerPubgIdData;
            squadPubgChampionship.findOneAndUpdate(
                {
                  endDate:"no date added",
                },
                {
                  $push: dataLastIndex 
                },
                {
                  runValidators: true,
                  projection: { "_id" : 0, "endDate" : 1 }
                }
              ).then(data=>{
                if(data != null){
                  for (let index = 0; index < hackersData.length; index++) {
                    const element = hackersData[index];
                    squadReportHacke.push(element.hackerPubgId);
                  }
                  for (let index = 0; index < winnerPubgIdData.length; index++) {
                    const element = hackersData[index];
                    squadWinnersPubg.push(element);
                  }
                  res.status(200).json({
                      message:"data added successfuly"
                  });               
                }
                else{
                    res.status(200).json({
                        message:"error occur"
                    });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in addSubHackersAndWinners');console.log(error);
                res.status(201).json({message:"error occur"});
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in addSubHackersAndWinners");
        console.log(error);
        res.status(201).json({
            message:"error occur"
        });
    })
  });

  squadPubgRouters.get("/getReportHackers" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json([]);
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json([]);
        }
        else{
          squadPubgChampionship.aggregate([
            {
              $match:
                { 
                  endDate:{ $eq: "no date added"}
                }
            },
            {
              $project:{
                _id:0,
                lastIndexHackerAndWinnersPubg:{
                  $cond: {
                    if: {
                      $gt: [ {$size: { $ifNull: [ "$realHackerAndWinnersPubg", [] ] }}, 0 ]
                    },
                    then:{
                      $slice: [ "$realHackerAndWinnersPubg", -1 ]
                    },
                    else:[]
                  }
                }
              }
            },
            {
              $unwind: {path: "$lastIndexHackerAndWinnersPubg"}
            },
            {
              $project:{
                hackersData:"$lastIndexHackerAndWinnersPubg.realHacker",
              }
            }]
              ).then(data=>{
                if(data.length != 0 ){
                    res.status(200).json(data[0].hackersData);              
                }
                else{
                    res.status(200).json([]);
                }
              })
              .catch(error=>{console.log('error in  squad admin in aggregate in getReportHackers');console.log(error);
                res.status(201).json([]);
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in getReportHackers");
        console.log(error);
        res.status(201).json([]);
    })
  });
  
  
  squadPubgRouters.get("/getReportHackersNoConnect" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json([]);
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json([]);
        }
        else{
          res.status(200).json(squadReportHacke);
        }
    })
    .catch(error =>{
        console.log("error in squad admin in getReportHackersNoConnect");
        console.log(error);
        res.status(201).json([]);
    })
  });
  
  squadPubgRouters.get("/getWinnersPubg" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json([]);
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json([]);
        }
        else{
          squadPubgChampionship.aggregate([
            {
              $match:
                { 
                  endDate:{ $eq: "no date added"}
                }
            },
            {
              $project:{
                _id:0,
                lastIndexHackerAndWinnersPubg:{
                  $cond: {
                    if: {
                      $gt: [ {$size: { $ifNull: [ "$realHackerAndWinnersPubg", [] ] }}, 0 ]
                    },
                    then:{
                      $slice: [ "$realHackerAndWinnersPubg", -1 ]
                    },
                    else:[]
                  }
                }
              }
            },
            {
              $unwind: {path: "$lastIndexHackerAndWinnersPubg"}
            },
            {
              $project:{
                winnersPubgData:"$lastIndexHackerAndWinnersPubg.winnersPubgId",
              }
            }]
              ).then(data=>{
                if(data.length != 0 ){
                    res.status(200).json(data[0].winnersPubgData);              
                }
                else{
                    res.status(200).json([]);
                }
              })
              .catch(error=>{console.log('error in  squad admin in aggregate in getWinnersPubg');console.log(error);
                res.status(201).json([]);
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in getWinnersPubg");
        console.log(error);
        res.status(201).json([]);
    })
  });
  
  squadPubgRouters.get("/getWinnersPubgNoConnect" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json([]);
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json([]);
        }
        else{
          res.status(200).json(squadWinnersPubg);
        }
    })
    .catch(error =>{
        console.log("error in squad admin in getWinnersPubgNoConnect");
        console.log(error);
        res.status(201).json([]);
    })
  });
  
  squadPubgRouters.get("/deleteHackersAndWinners" ,checkAuth, (req,res)=>{
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
                message:"error occur"
            });
        }
        else if(data[0].email == "noemail@email.com"){
            res.status(200).json({
                message:"error occur"
            });
        }
        else{
          squadPubgChampionship.findOneAndUpdate(
                {
                  endDate:"no date added",
                },
                { 
                  $pop: { 
                    realHackerAndWinnersPubg: 1 
                  } 
                },
                {
                  runValidators: true,
                  projection: { "_id" : 0, "endDate" : 1 }
                }
              ).then(data=>{
                if(data != null){
                  squadReportHacke = [];
                  squadWinnersPubg = [];
                  res.status(200).json({
                      message:"delete hackers and winners successfuly"
                  });                
                }
                else{
                    res.status(200).json({
                        message:"error occur"
                    });
                }
              })
              .catch(error=>{console.log('error in  squad admin in findOneAndUpdate in deleteHackersAndWinners');console.log(error);
                res.status(201).json({message:"error occur"});
            });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in deleteHackersAndWinners");
        console.log(error);
        res.status(201).json({
            message:"error occur"
        });
    })
  });
  
  squadPubgRouters.get("/hAWFromDatabaseToServer" ,checkAuth, (req,res)=>{ //hAW mean hackers and winners
    adminSchema.find()
    .then(data => {
        if(data.length == 0)
        {
            res.status(200).json({
              message:"error occur"
            });
        }
        else if(data[0].email == "noemail@email.com"){
          res.status(200).json({
            message:"error occur"
          });
        }
        else{
          squadPubgChampionship.aggregate([
            {
              $match:
                { 
                  endDate:{ $eq: "no date added"}
                }
            },
            {
              $project:{
                _id:0,
                lastIndexHackerAndWinnersPubg:{
                  $cond: {
                    if: {
                      $gt: [ {$size: { $ifNull: [ "$realHackerAndWinnersPubg", [] ] }}, 0 ]
                    },
                    then:{
                      $slice: [ "$realHackerAndWinnersPubg", -1 ]
                    },
                    else:[]
                  }
                }
              }
            },
            {
              $unwind: {path: "$lastIndexHackerAndWinnersPubg"}
            },
            {
              $project:{
                hackersPubgIdData:"$lastIndexHackerAndWinnersPubg.realHacker.hackerPubgId",
                winnersPubgIdData:"$lastIndexHackerAndWinnersPubg.winnersPubgId",
              }
            }]
            ).then(data=>{
              if(data.length != 0){
                squadReportHacke = data[0].hackersPubgIdData;
                squadWinnersPubg = data[0].winnersPubgIdData;
                res.status(200).json({
                  message:"data added successfuly"
                });
              }
              else{
                res.status(200).json({
                  message:"error occur"
                });
              }
            })
            .catch(error=>{console.log('error in  squad admin in aggregate in hAWFromDatabaseToServer');console.log(error);
            res.status(200).json({
              message:"error occur"
            });
          });
        }
    })
    .catch(error =>{
        console.log("error in squad admin in hAWFromDatabaseToServer");
        console.log(error);
        res.status(200).json({
          message:"error occur"
        });
    })
});






/* test */

squadPubgRouters.get("/testaddSquad" ,checkAuth, (req,res)=>{
  adminSchema.find()
  .then(data => {
      if(data.length == 0)
      {
          res.status(200).json({
              message:"error occur"
          });
      }
      else if(data[0].email == "noemail@email.com"){
          res.status(200).json({
              message:"error occur"
          });
      }
      else{console.log("kkk");
        let players = [];
          for (let index = 0; index < 10000; index++) {
            players.push({emailTeamLeader:"mostafa"+index+"@gmail.com" ,pubgIdTeamLeader:"0000000"+index
            ,emailFirstMember:"mostafa"+index+"@gmail.com" ,pubgIdFirstMember:"0000000"+index , acceptFirstPlayer:true
            ,emailSecondMember:"mostafa"+index+"@gmail.com" ,pubgIdSecondMember:"0000000"+index , acceptSecondPlayer:true
            ,emailThirdMember:"mostafa"+index+"@gmail.com" ,pubgIdThirdMember:"0000000"+index , acceptThirdPlayer:true})
          }console.log("uuuuuu");
          squadPubgChampionship.findOneAndUpdate(
              {
                endDate:"no date added",
              },
              {
                $push: { players: { $each: players } }
              },
              {
                runValidators: true,
                projection: { "_id" : 0, "endDate" : 1 }
              }
            ).then(data=>{console.log(data);
              if(data != null){
                      console.log("good");       
              }
              else{
                console.log("bad");   
              }
            })
            .catch(error=>{console.log("bad"); 
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in addAdsWillAppear");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

squadPubgRouters.get("/addhackerswinners" ,checkAuth, (req,res)=>{
  adminSchema.find()
  .then(data => {
      if(data.length == 0)
      {
          res.status(200).json({
              message:"error occur"
          });
      }
      else if(data[0].email == "noemail@email.com"){
          res.status(200).json({
              message:"error occur"
          });
      }
      else{console.log("kkk");
        let hackers = [];
        let winners = [];
          for (let index = 0; index < 10000; index++) {
            hackers.push({hackerPubgId:"0000000"+index ,email:"mostafa"+index+"@gmail.com"});
            winners.push("1111111"+index);
          }console.log("uuuuuu");
          squadPubgChampionship.findOneAndUpdate(
              {
                endDate:"no date added",
              },
              {
                $push: { realHackerAndWinnersPubg: { $each: [{round:0 , realHacker:hackers , winnersPubgId:winners}] } }
              },
              {
                runValidators: true,
                projection: { "_id" : 0, "endDate" : 1 }
              }
            ).then(data=>{console.log(data);
              if(data != null){
                      console.log("good");
                      res.status(201).json({
                        message:"error occur"
                    });

              }
              else{
                console.log("bad");   
                res.status(201).json({
                  message:"error occur"
              });
              }
            })
            .catch(error=>{console.log("bad");
            res.status(201).json({
              message:"error occur"
          }); 
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in addAdsWillAppear");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

module.exports = squadPubgRouters;