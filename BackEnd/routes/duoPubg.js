const express = require('express');
const duoPubgRouters = express.Router();
const duoPubgChampionship = require('../models/duoPubgChampionship');
const adminSchema = require('../models/adminSchema');
const paidAds = require('../models/paidAds');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const geoip = require('geoip-lite');
const checkAuth = require('../middleware/check-auth');
var duoCharityAds = {};
var duoFreeAds = {};
var duoSplitPlayers = [];
var duoReportHacke = [];
var duoWinnersPubg = [];
var duoApperHackerAndWinners = false;

function duoGetAdNoConnect(country){
    let sendData = {
      register : false,
      videoId : null,
      videoType : "noType",
      adAppearanceCountry:null
    };
    if(typeof duoFreeAds !== 'undefined' && Object.keys(duoFreeAds).length != 0 && (duoFreeAds.ALL != undefined || duoFreeAds[country] != undefined)){
      if(duoFreeAds.ALL != undefined && duoFreeAds[country] != undefined){
        let AllCountery = ["ALL" , country];
        let adAppearanceCountry = AllCountery[Math.floor(AllCountery.length * Math.random())];
        let videoId = duoFreeAds[adAppearanceCountry][Math.floor(duoFreeAds[adAppearanceCountry].length * Math.random())]
        sendData={
          register : false,
          videoId : videoId,
          videoType : "noType",
          adAppearanceCountry:adAppearanceCountry
        }
      }
      else if(duoFreeAds.ALL != undefined){
        let videoId = duoFreeAds["ALL"][Math.floor(duoFreeAds["ALL"].length * Math.random())];
        sendData={
          register : false,
          videoId : videoId,
          videoType : "noType",
          adAppearanceCountry:"ALL"
        }
      }
      else{
        let videoId = duoFreeAds[country][Math.floor(duoFreeAds[country].length * Math.random())];
        sendData={
          register : false,
          videoId : videoId,
          videoType : "noType",
          adAppearanceCountry:country
        }
      }
    }
    else{
      if(duoCharityAds.ALL != undefined && duoCharityAds[country] != undefined){
        let AllCountery = ["ALL" , country];
        let adAppearanceCountry = AllCountery[Math.floor(AllCountery.length * Math.random())];
        let videoId = duoCharityAds[adAppearanceCountry][Math.floor(duoCharityAds[adAppearanceCountry].length * Math.random())]
        sendData={
          register : false,
          videoId : videoId,
          videoType : "noType",
          adAppearanceCountry:adAppearanceCountry
        }
      }
      else if(duoCharityAds.ALL != undefined){
        let videoId = duoCharityAds["ALL"][Math.floor(duoCharityAds["ALL"].length * Math.random())];
        sendData={
          register : false,
          videoId : videoId,
          videoType : "noType",
          adAppearanceCountry:"ALL"
        }
      }
      else{
        let videoId = duoCharityAds[country][Math.floor(duoCharityAds[country].length * Math.random())];
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
  
  duoPubgRouters.post("/sendEmailConfirm",(req ,res)=>{
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
  
  duoPubgRouters.put('/increaseVideoId',(req,res)=>{
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
      duoPubgChampionship.updateOne(
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
      duoPubgChampionship.updateOne(
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
    /*else if(videoType == 'nativecharity')
    {
      charitableAds.updateOne(
        {
          videoId:videoId ,
          adAppearanceCountry:adAppearanceCountry,
        },
        {
          $inc: { viewsNumber: 1}
        }
      ).then(e=>{res.status(200).json(true);}).catch(error => res.status(200).json(false));
    }*/
  });
  
  duoPubgRouters.post("/tLRegisterGetAd", (req,res)=>{  //tL mean team leader
   let country = undefined ;
   if(req.body.ip != undefined){
     let conuntryData = geoip.lookup(req.body.ip);
     if(conuntryData != null){
       country = conuntryData.country;
     }
   }
  
   if(mongoose.connection.readyState == 1){
       
     duoPubgChampionship.aggregate([
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
         /*console.log("aaaaa");
         let carityAd = await getCharityAd(country);
         console.log(carityAd);
         if(carityAd.length != 0)
         {
           sendData = {
             register : false,
             videoId : carityAd[0].videoId,
             videoType : carityAd[0].videoType,
             adAppearanceCountry:carityAd[0].adAppearanceCountry
           }
         }*/
         sendData = duoGetAdNoConnect(country);
       }
       res.status(200).json(sendData);
     })
     .catch(error => {
        console.log("error duo team leader register get ad");
        console.log(error);
        let sendData = duoGetAdNoConnect(country);
        res.status(200).json(sendData);
      });
   }
   else{
     let sendData = duoGetAdNoConnect(country);
     res.status(200).json(sendData);
     /*if(Object.keys(duoFreeAds).length > 0 != 0 && (duoFreeAds.ALL != undefined || duoFreeAds[country] != undefined)){
       if(duoFreeAds.ALL != undefined && duoFreeAds[country] != undefined){
         let AllCountery = ["ALL" , country];
         let adAppearanceCountry = AllCountery[Math.floor(AllCountery.length * Math.random())];
         let videoId = duoFreeAds[adAppearanceCountry][Math.floor(duoFreeAds[adAppearanceCountry].length * Math.random())]
         sendData={
           register : false,
           videoId : videoId,
           videoType : "noType",
           adAppearanceCountry:adAppearanceCountry
         }
         res.status(200).json(sendData);
       }
       else if(duoFreeAds.ALL != undefined){
         let videoId = duoFreeAds["ALL"][Math.floor(duoFreeAds["ALL"].length * Math.random())];
         sendData={
           register : false,
           videoId : videoId,
           videoType : "noType",
           adAppearanceCountry:"ALL"
         }
         res.status(200).json(sendData);
       }
       else{
         let videoId = duoFreeAds[country][Math.floor(duoFreeAds[country].length * Math.random())];
         sendData={
           register : false,
           videoId : videoId,
           videoType : "noType",
           adAppearanceCountry:country
         }
         res.status(200).json(sendData);
       }
     }
     else{
       if(duoCharityAds.ALL != undefined && duoCharityAds[country] != undefined){
         let AllCountery = ["ALL" , country];
         let adAppearanceCountry = AllCountery[Math.floor(AllCountery.length * Math.random())];
         let videoId = duoCharityAds[adAppearanceCountry][Math.floor(duoCharityAds[adAppearanceCountry].length * Math.random())]
         sendData={
           register : false,
           videoId : videoId,
           videoType : "noType",
           adAppearanceCountry:adAppearanceCountry
         }
         res.status(200).json(sendData);
       }
       else if(duoCharityAds.ALL != undefined){
         let videoId = duoCharityAds["ALL"][Math.floor(duoCharityAds["ALL"].length * Math.random())];
         sendData={
           register : false,
           videoId : videoId,
           videoType : "noType",
           adAppearanceCountry:"ALL"
         }
         res.status(200).json(sendData);
       }
       else{
         let videoId = duoCharityAds[country][Math.floor(duoCharityAds[country].length * Math.random())];
         sendData={
           register : false,
           videoId : videoId,
           videoType : "noType",
           adAppearanceCountry:country
         }
         res.status(200).json(sendData);
       }
     }*/
   }
  });
  
  /*app.get("/api/checkduotlusername",(req,res)=>{//tl mean team leader
    
    let userName = req.query.username;
    duoPubgChampionship.aggregate([
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
    .catch(error=>{console.log("error in checkduotlusername");console.log(error); res.status(200).json({acceptData:true,error:true,oldUserName:userName});});
  });
  */
  
 duoPubgRouters.get("/checkTLGmailAccount",(req,res)=>{
    
    let gmailaccount = req.query.gmailaccount;
    console.log(gmailaccount);
    duoPubgChampionship.aggregate([
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
    .catch(error=>{console.log("error in checkduotlgmailaccount");console.log(error); res.status(200).json({acceptData:false,error:true,oldGmail:gmailaccount});});
  });
  
  
  duoPubgRouters.get("/checkTLIdPubg",(req,res)=>{
    
    let idPubg = req.query.idpubg;
    duoPubgChampionship.aggregate([
      {
        $match:
          { $and:
            [
              {endDate:{ $eq: "no date added"}},
              {
                $or: [
                  {"players.pubgIdTeamLeader":{ $eq: idPubg}},
                  {"players.pubgIdMember":{ $eq: idPubg}},
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
    .then(data => {console.log(data);
      if(data.length == 0 ){
        res.status(200).json({acceptData:true,error:false,oldIdPubg:idPubg});
      }else{
        res.status(200).json({acceptData:false,error:false,oldIdPubg:idPubg});
      }
    })
    .catch(error=>{console.log("error in checkduotlidpubg");console.log(error); res.status(200).json({acceptData:false,error:true,oldIdPubg:idPubg});});
  });
  
  duoPubgRouters.get("/checkTLFIdPubg",(req,res)=>{//tlf mean team leader friend
    
    let idPubg = req.query.idpubg;
    duoPubgChampionship.aggregate([
      {
        $match:
          { $and:
            [
              {endDate:{ $eq: "no date added"}},
              {
                $or: [
                  {"players.pubgIdTeamLeader":{ $eq: idPubg}},
                  {"players.pubgIdMember":{ $eq: idPubg}},
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
    .catch(error=>{console.log("error in checkduotlfidpubg");console.log(error); res.status(200).json({acceptData:false,error:true,oldMemberIdPubg:idPubg});});
  
  });
  
  //send email route one for all component
  
  duoPubgRouters.post("/tLSendData",(req ,res)=>{
    duoPubgChampionship.aggregate([
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
    ]).then(register=>{
      if(register.length > 0 /*&& req.body.userName != undefined*/ && req.body.email != undefined && req.body.pubgId != undefined && req.body.memberPubgId != undefined && req.body.pubgId != req.body.memberPubgId){
        if(register[0].register == true){
  
          if(req.body.videoId == undefined)
          {
            req.body.videoId = "error occur";
          }
          let idPubg = req.body.pubgId;
          let memberPubgId = req.body.memberPubgId;
          /*let find = duoPubgChampionship.findOne({
            endDate:"no date added",
           "players.userNameTeamLeader": { $not: { $in: [req.body.userName] } },
           "players.emailTeamLeader": { $not: { $in: [req.body.email] } },
           "players.pubgIdTeamLeader": { $not: { $in: [req.body.pubgId] } }
          });
          let pushData = {
                          userNameTeamLeader:req.body.userName ,
                          emailTeamLeader : req.body.email , 
                          pubgIdTeamLeader : req.body.pubgId , 
                          pubgIdMember : req.body.memberPubgId , 
                          displayedAdTeamLeader : req.body.videoId
                        }
          find.players.push(pushData);
          find.save();*/
          duoPubgChampionship.findOneAndUpdate(
            {
              endDate:"no date added",
              "players.emailTeamLeader": { $not: { $in: [req.body.email] } },
             /*"players.userNameTeamLeader": { $not: { $in: [req.body.userName] } },
             "players.emailTeamLeader": { $not: { $in: [req.body.email] } },
             "players.pubgIdTeamLeader": { $not: { $in: [idPubg] } },
             "players.pubgIdMember": { $not: { $in: [idPubg] } },
             "players.pubgIdTeamLeader": { $not: { $in: [memberPubgId] } },
             "players.pubgIdMember": { $not: { $in: [memberPubgId] } }*/
            },
            {
              $push: { players: { $each: [ {emailTeamLeader : req.body.email , pubgIdTeamLeader : idPubg , pubgIdMember : memberPubgId, displayedAdTeamLeader : req.body.videoId} ] } }
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
              console.log('error in  tlDuoSendData in findOneAndUpdate in nModified');
              res.status(201).json({message:"an error occur please register again"});
            }
          })
          .catch(error=>{console.log('error in  tlDuoSendData in findOneAndUpdate');console.log(error);  res.status(201).json({message:"error because overloads of server. register after some minutes when overloads of server go down"});});
            
        }
        else{
          res.status(201).json({message:"sorry register is finished when you added your data"});
        }
      }
      else{console.log('error in  tlDuoSendData in aggregate in undefinde data');
        res.status(201).json({ message:"an error occur please register again"});
      }
    }).catch(error=>{console.log('error in  tlDuoSendData in aggregate');console.log(error); res.status(201).json({message:"error because overloads of server. register after some minutes when overloads of server go down"});});
  });
  
  duoPubgRouters.post("/memberReGetAd", (req,res)=>{  //re mean register
    let country = undefined ;
    if(req.body.ip != undefined){
      let conuntryData = geoip.lookup(req.body.ip);
      if(conuntryData != null){
        country = conuntryData.country;
      }
    }
    if(mongoose.connection.readyState == 1){
        
      duoPubgChampionship.aggregate([
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
          /*console.log("aaaaa");
          let carityAd = await getCharityAd(country);
          console.log("bbbbb");
          if(carityAd.length != 0)
          {
            sendData = {
              register : false,
              videoId : carityAd[0].videoId,
              videoType : carityAd[0].videoType,
              adAppearanceCountry:carityAd[0].adAppearanceCountry
            }
          }*/
          sendData = duoGetAdNoConnect(country);
        }
        res.status(200).json(sendData);
      })
      .catch(error => {
        console.log("error duo member register get ad");
        console.log(error);
        /*let videoId = duoCharityAds["ALL"][Math.floor(duoCharityAds["ALL"].length * Math.random())];
         sendData={
           register : false,
           videoId : videoId,
           videoType : "noType",
           adAppearanceCountry:"ALL"
         }*/
        let sendData = duoGetAdNoConnect(country);
        res.status(200).json(sendData);
      });
    }
    else{
      let sendData = duoGetAdNoConnect(country);
      res.status(200).json(sendData);
      /*if(Object.keys(duoFreeAds).length > 0 != 0 && (duoFreeAds.ALL != undefined || duoFreeAds[country] != undefined)){
        if(duoFreeAds.ALL != undefined && duoFreeAds[country] != undefined){console.log(country)
          let AllCountery = ["ALL" , country];
          let adAppearanceCountry = AllCountery[Math.floor(AllCountery.length * Math.random())];
          let videoId = duoFreeAds[adAppearanceCountry][Math.floor(duoFreeAds[adAppearanceCountry].length * Math.random())]
          sendData={
            register : false,
            videoId : videoId,
            videoType : "noType",
            adAppearanceCountry:adAppearanceCountry
          }
          res.status(200).json(sendData);
        }
        else if(duoFreeAds.ALL != undefined){
          let videoId = duoFreeAds["ALL"][Math.floor(duoFreeAds["ALL"].length * Math.random())];
          sendData={
            register : false,
            videoId : videoId,
            videoType : "noType",
            adAppearanceCountry:"ALL"
          }
          res.status(200).json(sendData);
        }
        else{
          let videoId = duoFreeAds[country][Math.floor(duoFreeAds[country].length * Math.random())];
          sendData={
            register : false,
            videoId : videoId,
            videoType : "noType",
            adAppearanceCountry:country
          }
          res.status(200).json(sendData);
        }
      }
      else{
        if(duoCharityAds.ALL != undefined && duoCharityAds[country] != undefined){
          let AllCountery = ["ALL" , country];
          let adAppearanceCountry = AllCountery[Math.floor(AllCountery.length * Math.random())];
          let videoId = duoCharityAds[adAppearanceCountry][Math.floor(duoCharityAds[adAppearanceCountry].length * Math.random())]
          sendData={
            register : false,
            videoId : videoId,
            videoType : "noType",
            adAppearanceCountry:adAppearanceCountry
          }
          res.status(200).json(sendData);
        }
        else if(duoCharityAds.ALL != undefined){
          let videoId = duoCharityAds["ALL"][Math.floor(duoCharityAds["ALL"].length * Math.random())];
          sendData={
            register : false,
            videoId : videoId,
            videoType : "noType",
            adAppearanceCountry:"ALL"
          }
          res.status(200).json(sendData);
        }
        else{
          let videoId = duoCharityAds[country][Math.floor(duoCharityAds[country].length * Math.random())];
          sendData={
            register : false,
            videoId : videoId,
            videoType : "noType",
            adAppearanceCountry:country
          }
          res.status(200).json(sendData);
        }
      }*/
    }
  });
  
  /*app.get("/api/checkduomusername",(req,res)=>{//m mean member
    
    let userName = req.query.username;
    duoPubgChampionship.aggregate([
      {
        $match:
          { 
            $and:
            [
              {endDate:"no date added"},
              {
                $or: [
                  {"players.userNameTeamLeader":{ $eq: userName}},
                  {"players.userNameMember":{ $eq: userName}},
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
      console.log('error in checkduomusername');
      console.log(error);
      res.status(200).json({acceptData:false,error:true,oldUserName:userName});});
  });
  */
  
 duoPubgRouters.get("/checkMGmailAccount",(req,res)=>{
    let gmailaccount = req.query.gmailaccount;
    duoPubgChampionship.aggregate([
      { 
        $match:
          { $and:
            [
              {endDate:{ $eq: "no date added"}},
              {
                $or: [
                  {"players.emailTeamLeader":{ $eq: gmailaccount}},
                  {"players.emailMember":{ $eq: gmailaccount}},
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
      console.log('error in checkduomgmailaccount');
      console.log(error);
      res.status(200).json({acceptData:false,error:true,oldGmail:gmailaccount});
    });
  
  });
  
  duoPubgRouters.post("/sendMemberEmailConfirm",(req ,res)=>{
    let pubgId = req.body.pubgId;
    let teamLeaderPubgId = req.body.teamLeaderIdpubg;
    duoPubgChampionship.aggregate([
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
          checkIdPubg:{
            $cond: {
              if: {
                $in: [ pubgId, "$players.pubgIdMember"]
              },
              then: false,
              else: true
            }
          }
        }
      },
      {
        $project:{
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
                        $eq: [ "$$player.pubgIdMember", pubgId ]
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
                    $in: [ true, "$filterPlayer.acceptPlayer"]
                  }
                ]
              },
              then:true,
              else:false,
            }
          }
        }
      }
    ]).then(data =>{console.log(data[0].checkTeamleaderIdPubg);console.log(data[0].checkIdPubg);
      if(data.length > 0)
      {console.log(data);
        let sendData = {
          random : null,
          checkIdPubg : data[0].checkIdPubg,
          checkTeamleaderIdPubg: data[0].checkTeamleaderIdPubg,
          checkExistsBefore:data[0].checkExistsBefore,
          error:false
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
          error:true
        }
        res.status(201).json(sendData);
      }
    })
    .catch(error =>{
      console.log("error send Email duo member pubg championship");
      console.log(error);
      let sendData = {
        random : null,
        checkIdPubg : false,
        checkTeamleaderIdPubg: false,
        checkExistsBefore:false,
        error:true
      }
      res.status(201).json(sendData);
    })
    
  });
  
  duoPubgRouters.post("/mSendData",(req ,res)=>{
    let idPubg = req.body.pubgId;
    let memberPubgId = req.body.memberPubgId;
    duoPubgChampionship.findOneAndUpdate(
      {
        endDate:"no date added",
        "players.emailTeamLeader": { $not: { $in: [req.body.email] } },
        "players.emailMember": { $not: { $in: [req.body.email] } },
        /*"players.userNameTeamLeader": { $not: { $in: [req.body.userName] } },
        "players.emailTeamLeader": { $not: { $in: [req.body.email] } },
        "players.pubgIdTeamLeader": { $not: { $in: [idPubg] } },
        "players.userNameMember": { $not: { $in: [req.body.userName] } },
        "players.emailMember": { $not: { $in: [req.body.email] } },
        "players.pubgIdMember":{ $not: { $in: [memberPubgId] } },*/
        "players.pubgIdMember":{$in:[idPubg]},
        "players.pubgIdTeamLeader":{$in:[memberPubgId]},
        "players.acceptPlayer":{$in:[false]},
      },
      {
        $set: {
          "players.$.emailMember":req.body.email,
          "players.$.displayedAdMember":req.body.videoId,
          "players.$.acceptPlayer":true,
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
        console.log("error mDuoSendData in  nModified");
        res.status(201).json({message:"an error occur please register again"});
      }
      })
    .catch(error=>{console.log('error mDuoSendData');console.log(error); res.status(201).json({message:"an error occur please register again"});});
  });
  duoPubgRouters.post("/dateGetAd", (req,res)=>{  //re mean register
    let country = undefined ;
    if(req.body.ip != undefined){
      let conuntryData = geoip.lookup(req.body.ip);
      if(conuntryData != null){
        country = conuntryData.country;
      }
    }
    if(mongoose.connection.readyState == 1){
      duoPubgChampionship.aggregate([
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
          let tempData = duoGetAdNoConnect(country);
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
        console.log("error duo date get ad");
        console.log(error);
        let tempData = duoGetAdNoConnect(country);
        let sendData = {
          dateAppearance : false,
          videoId : tempData.videoId,
          videoType : tempData.videoType,
          adAppearanceCountry:tempData.adAppearanceCountry
        }
        if(typeof duoSplitPlayers !== 'undefined' && duoSplitPlayers.length != 0)
        {
          sendData.dateAppearance = true;
        }
        res.status(200).json(sendData);
       });
    }
    else{
      let tempData = duoGetAdNoConnect(country);
      let sendData = {
        dateAppearance : false,
        videoId : tempData.videoId,
        videoType : tempData.videoType,
        adAppearanceCountry:tempData.adAppearanceCountry
      }
      if(typeof duoSplitPlayers !== 'undefined' && duoSplitPlayers.length != 0)
      {
        sendData.dateAppearance = true;
      }
      res.status(200).json(sendData);
    }
  });
  
  duoPubgRouters.get("/getPlayerDate",(req,res)=>{
    let idPubg = req.query.idpubg;
    if(mongoose.connection.readyState == 1){
      duoPubgChampionship.aggregate([
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
                        {$in: [idPubg , "$$filterData.groupPlayers.pubgIdMember"]},
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
          if(data[0].data.date.length != 0 /*&& data[0].data.day.length != 0 */&& data[0].data.time.length != 0)
          {
            date = {
              date: data[0].data.date[0],
              //day:"day : "+data[0].data.day[0],
              time: data[0].data.time[0],
              message:'your next round will start in'
            }
          }
          else{
            date = {
              date : null,
              time:null,
              message:'the idPubg not exist'
            }
          }
        }
        else{
          date  = {
            date : null,
            time:null,
            message:'error occure please click on show date again'
          }
        }
        res.status(200).json(date);
      })
      .catch(error=>{
        console.log('error in getduoplayerdate');
        console.log(error);
        let date  = {
          date : null,
          //day:null,
          time:null,
          message:'the idPubg not exist'
        }
        if(typeof duoSplitPlayers !== 'undefined' && duoSplitPlayers.length != 0)
        {
          for (let index = 0; index < duoSplitPlayers.length; index++) {
            const element = duoSplitPlayers[index];
            if(typeof element.groupPlayers !== 'undefined' && element.groupPlayers.filter(subElement => subElement.pubgIdTeamLeader == idPubg || subElement.pubgIdMember == idPubg).length > 0)
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
      let date = {
        date : null,
        //day:null,
        time:null,
        message:'the idPubg not exist'
      }
      if(typeof duoSplitPlayers !== 'undefined' && duoSplitPlayers.length != 0)
      {
        for (let index = 0; index < duoSplitPlayers.length; index++) {
          const element = duoSplitPlayers[index];
          if(typeof element.groupPlayers !== 'undefined' && element.groupPlayers.filter(subElement => subElement.pubgIdTeamLeader == idPubg || subElement.pubgIdMember == idPubg).length > 0)
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
  duoPubgRouters.post("/freeAdGetAd", (req,res)=>{  //re mean register
    let country = undefined ;
    if(req.body.ip != undefined){
      country = geoip.lookup(req.body.ip).country;
    }
    if(mongoose.connection.readyState == 1){
      duoPubgChampionship.aggregate([
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
          let tempData = duoGetAdNoConnect(country);
          sendData.videoId = tempData.videoId;
          sendData.videoType = tempData.videoType;
          sendData.adAppearanceCountry = tempData.adAppearanceCountry;
        }
        res.status(200).json(sendData);
      })
      .catch(error => {
        console.log('error in duofreeadgetad');
        console.log(error);
        let tempData = duoGetAdNoConnect(country);
        let sendData = {
          freeAdResgister : false,
          videoId : tempData.videoId,
          videoType : tempData.videoType,
          adAppearanceCountry:tempData.adAppearanceCountry,
          adsWillAppear:[]
        }
        if(typeof duoFreeAds !== 'undefined')
        {
          let freeAdsWillAppear = [];
          let freeAdValues = Object.values(duoFreeAds);
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
      let tempData = duoGetAdNoConnect(country);
      let sendData = {
        freeAdResgister : false,
        videoId : tempData.videoId,
        videoType : tempData.videoType,
        adAppearanceCountry:tempData.adAppearanceCountry,
        adsWillAppear:[]
      };
      if(typeof duoFreeAds !== 'undefined')
      {
        let freeAdsWillAppear = [];
        let freeAdValues = Object.values(duoFreeAds);
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
  /*app.get("/checkduousernamefreead",(req,res)=>{
    let userName = req.query.username;
    duoPubgChampionship.aggregate([
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
    .catch(error=>{console.log("error in checkduousernamefreead");console.log(error); res.status(200).json({acceptData:false,error:true,oldUserName:userName});});
  });*/
  duoPubgRouters.get("/checkGmailAccountFreeAd",(req,res)=>{
    let gmailaccount = req.query.gmailaccount;
    duoPubgChampionship.aggregate([
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
    .catch(error=>{console.log("error in checkduogmailaccountfreead");console.log(error); res.status(200).json({acceptData:false,error:true,oldGmail:gmailaccount});});
  });
  duoPubgRouters.get("/checkYoutubeFreeAd",(req,res)=>{
    
    let youtube = req.query.youtube;
    duoPubgChampionship.aggregate([
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
    .catch(error=>{console.log("error in checkduoyoutubefreead");console.log(error); res.status(200).json({acceptData:false,error:true,oldYoutube:youtube});});
  });
  duoPubgRouters.post("/sendDataFreeAd",(req ,res)=>{
    duoPubgChampionship.findOneAndUpdate(
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
        console.log('error in duo SendData in findOneAndUpdate in nModified');
        res.status(201).json({message:"an error occur please register again"});
      }
    })
    .catch(error=>{console.log('error in duo SendData in findOneAndUpdate');console.log(error);;res.status(201).json({message:"error because overloads of server. register after some minutes when overloads of server go down"});});
  }); 
  
  duoPubgRouters.get("/reportHackerRegister", (req,res)=>{  //re mean register
    if(mongoose.connection.readyState == 1){
      duoPubgChampionship.aggregate([
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
          /*hackerAppear:[],
          winnersPubgAppear:[],*/
        };
        if(data.length != 0){
          sendData.reportHackerResgister = data[0].reportHackerResgister;
          sendData.apperHackerAndWinners = data[0].apperHackerAndWinners;
          /*sendData.hackerAppear = data[0].hackerAppear;
          sendData.winnersPubgAppear = data[0].winnersPubgAppear;*/
        }
        else{
          sendData.apperHackerAndWinners = duoApperHackerAndWinners;
        }
        res.status(200).json(sendData);
      })
      .catch(error => {
        console.log('error in duoreporthackerregister');
        console.log(error);
        let sendData = {
          reportHackerResgister : false,
          apperHackerAndWinners : duoApperHackerAndWinners,
        };
        res.status(200).json(sendData);
      });
    }
    else{
      let sendData = {
        reportHackerResgister : false,
        apperHackerAndWinners : duoApperHackerAndWinners,
      };
      res.status(200).json(sendData);   
    }
  });
  
  duoPubgRouters.get("/checkGmailAccountHacker",(req,res)=>{
    let gmailaccount = req.query.gmailaccount;
    duoPubgChampionship.aggregate([
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
    .catch(error=>{console.log("error in checkduogmailaccounthacker");console.log(error); res.status(200).json({acceptData:false,error:true,oldGmail:gmailaccount});});
  });
  
  duoPubgRouters.get("/checkGoogleDriveHacker",(req,res)=>{
    let googleDrive = req.query.googledrive;
    duoPubgChampionship.aggregate([
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
    .catch(error=>{console.log("error in checkduogoogledrivehacker");console.log(error); res.status(200).json({acceptData:false,error:true,oldGoogleDrive:googleDrive});});
  });
  
  duoPubgRouters.post("/sendDataHacker",(req ,res)=>{
    duoPubgChampionship.findOneAndUpdate(
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
        console.log('error in duo SendDataHacker in findOneAndUpdate in nModified');
        res.status(201).json({message:"an error occur please register again"});
      }
    })
    .catch(error=>{console.log('error in duo SendDataHacker in findOneAndUpdate');console.log(error);;res.status(201).json({message:"error because overloads of server. register after some minutes when overloads of server go down"});});
  }); 
  
  duoPubgRouters.get("/getPlayerState",(req,res)=>{
    let idPubg = req.query.idpubg;
    if(mongoose.connection.readyState == 1){
      duoPubgChampionship.aggregate([
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
          if( typeof duoReportHacke !== 'undefined' && duoReportHacke.length != 0 && 
              typeof duoWinnersPubg !== 'undefined' && duoWinnersPubg.length != 0
            )
          {
            if(duoReportHacke.includes(idPubg))
            {
              message = 'you use hacker in last round';
            }
            else if(message == 'sorry you are not the winner in your group' && duoWinnersPubg.includes(idPubg))
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
        console.log('error in getduoplayerstate');
        console.log(error);
        let message  = "sorry you are not the winner in your group";
        if( typeof duoReportHacke !== 'undefined' && duoReportHacke.length != 0 && 
              typeof duoWinnersPubg !== 'undefined' && duoWinnersPubg.length != 0
            )
          {
            if(duoReportHacke.includes(idPubg))
            {
              message = 'you use hacker in last round';
            }
            else if(message == 'sorry you are not the winner in your group' && duoWinnersPubg.includes(idPubg))
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
      if( typeof duoReportHacke !== 'undefined' && duoReportHacke.length != 0 && 
            typeof duoWinnersPubg !== 'undefined' && duoWinnersPubg.length != 0
          )
        {
          if(duoReportHacke.includes(idPubg))
          {
            message = 'you use hacker in last round';
          }
          else if(message == 'sorry you are not the winner in your group' && duoWinnersPubg.includes(idPubg))
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

duoPubgRouters.get("/getPagesState" ,checkAuth, (req,res)=>{
  duoPubgChampionship.findOne(
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
  .catch(error=>{console.log("error in duo admin getPagesState");console.log(error); 
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

duoPubgRouters.get("/registerTeamLeaderTrue" ,checkAuth, (req,res)=>{
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
          duoPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in registerTeamLeaderTrue');
                  console.log(error);
                  res.status(201).json({message:"error occure try again"});
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in duo registerTeamLeaderTrue");
      console.log(error);
      res.status(201).json({
          message:"error occure try again"
      });
  })
});

duoPubgRouters.get("/registerMemberTrue" ,checkAuth, (req,res)=>{
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
          duoPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in registerMemberTrue');
                  console.log(error);
                  res.status(201).json({message:"error occure try again"});
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in duo registerMemberTrue");
      console.log(error);
      res.status(201).json({
          message:"error occure try again"
      });
  })
});

duoPubgRouters.get("/setFreeAdsTypeTrue" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in registerFreeAdsType');console.log(error);
              res.status(201).json({message:"error occure try again"});
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in registerFreeAdsType");
      console.log(error);
      res.status(201).json({
          message:"error occure try again"
      });
  })
});

duoPubgRouters.get("/setReportHackerTypeTrue" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in registerReportHackerType');console.log(error);
              res.status(201).json({message:"error occure try again"});
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in registerReportHackerType");
      console.log(error);
      res.status(201).json({
          message:"error occure try again"
      });
  })
});

duoPubgRouters.get("/setAppearHackerAndWinnersTrue" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOneAndUpdate(
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
                duoApperHackerAndWinners = true;
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in appearHackerAndWinnersPubgTrue');console.log(error);
              res.status(201).json({message:"error occure try again"});
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in appearHackerAndWinnersPubgTrue");
      console.log(error);
      res.status(201).json({
          message:"error occure try again"
      });
  })
});

duoPubgRouters.get("/setSplitPlayersTypeTrue" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in splitPlayersTypeTrue');console.log(error);
              res.status(201).json({message:"error occure try again"});
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in splitPlayersTypeTrue");
      console.log(error);
      res.status(201).json({
          message:"error occure try again"
      });
  })
});

duoPubgRouters.get("/registerTeamLeaderFalse" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in registerTeamLeaderFalse');
                  console.log(error);
                  res.status(201).json({message:"error occure try again"});
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in registerTeamLeaderFalse");
      console.log(error);
      res.status(201).json({
          message:"error occure try again"
      });
  })
});

duoPubgRouters.get("/registerMemberFalse" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in registerMemberFalse');
                  console.log(error);
                  res.status(201).json({message:"error occure try again"});
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in registerMemberFalse");
      console.log(error);
      res.status(201).json({
          message:"error occure try again"
      });
  })
});

duoPubgRouters.get("/setFreeAdsTypeFalse" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in registerFreeAdsTypeFalse');console.log(error);
              res.status(201).json({message:"error occure try again"});
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in registerFreeAdsTypeFalse");
      console.log(error);
      res.status(201).json({
          message:"error occure try again"
      });
  })
});

duoPubgRouters.get("/setReportHackerTypeFalse" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in registerReportHackerTypeFalse');console.log(error);
              res.status(201).json({message:"error occure try again"});
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in registerReportHackerTypeFalse");
      console.log(error);
      res.status(201).json({
          message:"error occure try again"
      });
  })
});

duoPubgRouters.get("/setAppearHackerAndWinnersFalse" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOneAndUpdate(
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
                duoApperHackerAndWinners = false;
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in appearHackerAndWinnersPubgFalse');console.log(error);
              res.status(201).json({message:"error occure try again"});
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in appearHackerAndWinnersPubgFalse");
      console.log(error);
      res.status(201).json({
          message:"error occure try again"
      });
  })
});

duoPubgRouters.get("/setSplitPlayersTypeFalse" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in splitPlayersTypeFalse');console.log(error);
              res.status(201).json({message:"error occure try again"});
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in splitPlayersTypeFalse");
      console.log(error);
      res.status(201).json({
          message:"error occure try again"
      });
  })
});

duoPubgRouters.post("/addChampion" ,checkAuth, (req,res)=>{
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
          const addNewDuoChampion = new duoPubgChampionship({
              startDate:req.body.startDate,
              totalPlayersNumber:req.body.totalPlayersNumber,
          });
          addNewDuoChampion.save()
          .then(data=>{
              res.status(200).json({
                  message:"championship added successfuly"
              });
          })
          .catch(error=>{
              console.log("error in duo admin in addChampion in save method");
              console.log(error)
              res.status(201).json({
                  message:"error occur"
              });
          });            
      }
  })
  .catch(error =>{
      console.log("error in duo admin in addChampion");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

duoPubgRouters.post("/endChampion" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in endChampion');console.log(error);
              res.status(201).json({message:"error occur"});
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in endChampion");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

duoPubgRouters.post("/addCharityAds" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOneAndUpdate(
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
                duoCharityAds = setCharityAds;
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in addCharityAds');console.log(error);
              res.status(201).json({message:"error occur"});
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in addCharityAds");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

duoPubgRouters.get("/getCharityAds" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOne(
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
            .catch(error=>{console.log('error in  duo admin in findOne in getCharityAds');console.log(error);
              res.status(201).json([]);
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in getCharityAds");
      console.log(error);
      res.status(201).json([]);
  })
});

duoPubgRouters.get("/getCharityAdsServer" ,checkAuth, (req,res)=>{
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
        res.status(200).json(duoCharityAds);
      }
  })
  .catch(error =>{
      console.log("error in duo admin in getCharityAdsServer");
      console.log(error);
      res.status(201).json({
        ads:{}
      });
  })
});

duoPubgRouters.get("/deleteCharityAds" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOneAndUpdate(
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
                duoCharityAds = {};
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in deleteCharityAds');console.log(error);
              res.status(201).json({message:"error occur"});
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in deleteCharityAds");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

duoPubgRouters.get("/CharityAdsFromDatabaseToServer" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOne(
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
                duoCharityAds = setCharityAds;
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
            .catch(error=>{console.log('error in  duo admin in findOne in charityAdsFromDatabaseToServer');console.log(error);
            res.status(200).json({
              message:"error occur"
            });
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in charityAdsFromDatabaseToServer");
      console.log(error);
      res.status(200).json({
        message:"error occur"
      });
  })
});


duoPubgRouters.post("/addPaidAdsToServer" ,checkAuth, (req,res)=>{
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
          duoPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in addPaidAdsToServer');console.log(error);
              res.status(201).json({message:"error occur"});
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in addPaidAdsToServer");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

duoPubgRouters.post("/addPaidAdToServer" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in addPaidAdToServer');console.log(error);
            res.status(200).json({
              message:"error occur"
            });
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in addPaidAdToServer");
      console.log(error);
      res.status(200).json({
        message:"error occur"
      });
  })
});

duoPubgRouters.get("/getPaidAds" ,checkAuth, (req,res)=>{
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
            .catch(error=>{console.log('error in  duo admin in find in getPaidAds');console.log(error);
              res.status(201).json([]);
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in getPaidAds");
      console.log(error);
      res.status(201).json([]);
  })
});

duoPubgRouters.get("/getDuoPaidAds" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOne(
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
            .catch(error=>{console.log('error in  duo admin in findOne in getDuoPaidAds');console.log(error);
              res.status(201).json([]);
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in getDuoPaidAds");
      console.log(error);
      res.status(201).json([]);
  })
});

duoPubgRouters.get("/deletePaidAds" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in deletePaidAds');console.log(error);
              res.status(201).json({message:"error occur"});
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in deletePaidAds");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

duoPubgRouters.post("/deletePaidAd" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in deletePaidAd');console.log(error);
              res.status(201).json({message:"error occur"});
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in deletePaidAd");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

duoPubgRouters.post("/addBlackList" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in addBlackList');console.log(error);
              res.status(201).json({message:"error occur"});
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in addBlackList");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

duoPubgRouters.get("/getBlackList" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOne(
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
            .catch(error=>{console.log('error in  duo admin in findOne in getBlackList');console.log(error);
              res.status(201).json([]);
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in getBlackList");
      console.log(error);
      res.status(201).json([]);
  })
});


duoPubgRouters.get("/deleteBlackList" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in deleteBlackList');console.log(error);
              res.status(201).json({message:"error occur"});
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in deleteBlackList");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

duoPubgRouters.get("/getRegisterAds" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOne(
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
            .catch(error=>{console.log('error in  duo admin in aggregate in getRegisterAds');console.log(error);
              res.status(201).json([]);
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in getRegisterAds");
      console.log(error);
      res.status(201).json([]);
  })
});

duoPubgRouters.post("/addFreeAdToServer" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOneAndUpdate(
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
                if(duoFreeAds.hasOwnProperty(adCountry)){
                  duoFreeAds[adCountry].push(videoId);
                }
                else{
                  duoFreeAds[adCountry] = [videoId];
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in addFreeAdToServer');console.log(error);
            res.status(200).json({
              message:"error occur"
            });
          });
      }
  })
  .catch(error =>{
      console.log("error in squad duo in addFreeAdToServer");
      console.log(error);
      res.status(200).json({
        message:"error occur"
      });
  })
});

duoPubgRouters.get("/getAdsWillAppear" ,checkAuth, (req,res)=>{
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
          duoPubgChampionship.aggregate([
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
            .catch(error=>{console.log('error in  duo admin in aggregate in getAdsWillAppear');console.log(error);
              res.status(201).json([]);
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in getAdsWillAppear");
      console.log(error);
      res.status(201).json([]);
  })
});


duoPubgRouters.post("/addAdsWillAppear" ,checkAuth, (req,res)=>{
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
          duoPubgChampionship.findOneAndUpdate(
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
                duoFreeAds = setFreeAds;
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in addAdsWillAppear');console.log(error);
              res.status(201).json({message:"error occur"});
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in addAdsWillAppear");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

duoPubgRouters.get("/getRealAdsWillAppear" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOne(
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
            .catch(error=>{console.log('error in  duo admin in aggregate in getRealAdsWillAppear');console.log(error);
              res.status(201).json([]);
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in getRealAdsWillAppear");
      console.log(error);
      res.status(201).json([]);
  })
});

duoPubgRouters.get("/getAdsWillAppearserver" ,checkAuth, (req,res)=>{
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
        res.status(200).json(duoFreeAds);
      }
  })
  .catch(error =>{
      console.log("error in duo admin in getAdsWillAppearserver");
      console.log(error);
      res.status(201).json({
        ads:{}
      });
  })
});

duoPubgRouters.get("/deleteAdsWillAppear" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOneAndUpdate(
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
                duoFreeAds = {};
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in deleteAdsWillAppear');console.log(error);
              res.status(201).json({message:"error occur"});
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in deleteAdsWillAppear");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

duoPubgRouters.post("/deleteFreeAd" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOneAndUpdate(
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
              duoFreeAds = setFreeAds;
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in deleteFreeAd');console.log(error);
              res.status(201).json({message:"error occur"});
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in deleteFreeAd");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

duoPubgRouters.get("/adsFromDatabaseToServer" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.aggregate([
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
                duoFreeAds = setFreeAds;
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
            .catch(error=>{console.log('error in  duo admin in aggregate in adsFromDatabaseToServer');console.log(error);
            res.status(200).json({
              message:"error occur"
            });
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in adsFromDatabaseToServer");
      console.log(error);
      res.status(200).json({
        message:"error occur"
      });
  })
});

duoPubgRouters.post("/addPlayer" ,checkAuth, (req,res)=>{
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
          let pubgIdMember = req.body.pubgIdMember;
          duoPubgChampionship.findOneAndUpdate(
            {
              endDate:"no date added",
            },
            {
              $push: { players: { $each: [ 
                { 
                  emailTeamLeader:"playtogain2020@gmail.com",
                  pubgIdTeamLeader:pubgIdTeamLeader ,
                  displayedAdTeamLeader:"adminData",
                  emailMember:"playtogain2020@gmail.com",
                  pubgIdMember:pubgIdMember ,
                  displayedAdMember:"adminData",
                  acceptPlayer:true
                } 
              ] } }
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in addPlayer');console.log(error);
            res.status(200).json({
              message:"error occur"
            });
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in addPlayer");
      console.log(error);
      res.status(200).json({
        message:"error occur"
      });
  })
});


duoPubgRouters.get("/deletePlayer" ,checkAuth, (req,res)=>{
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
          duoPubgChampionship.findOneAndUpdate(
            {
              endDate:"no date added",
            },
            { 
              $pull: { players: { $or: [
                {  pubgIdTeamLeader: pubgId },
                { pubgIdMember: pubgId } 
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in deletePlayer');console.log(error);
            res.status(200).json({
              message:"error occur"
            });
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in deletePlayer");
      console.log(error);
      res.status(200).json({
        message:"error occur"
      });
  })
});

duoPubgRouters.get("/getPubgIds" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.aggregate([
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
                    $eq: [ "$$players.acceptPlayer" ,true ]
                  }
                }
              },
            }
          },
          {
            $project:{
              "playersData.pubgIdTeamLeader":1,
              "playersData.pubgIdMember":1
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
          console.log('error in  duo admin in findOne in getPubgIds');console.log(error);
          res.status(201).json([]);
        });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in getPubgIds");
      console.log(error);
      res.status(201).json([]);
  })
});

duoPubgRouters.post("/splitPlayer" ,checkAuth, (req,res)=>{
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
          duoPubgChampionship.findOneAndUpdate(
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
                duoSplitPlayers = [];
                for (let index = 0; index < playersData.length; index++) {
                  let element = playersData[index];
                  let pubgIds = [];
                  let pubgIdArray = playersData[index].groupPlayers;
                  for (let subIndex = 0; subIndex < pubgIdArray.length; subIndex++) {
                    let subElement = pubgIdArray[subIndex];
                    pubgIds.push(subElement);
                  }
                  duoSplitPlayers.push({
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in splitPlayer');console.log(error);
              res.status(201).json({message:"error occur"});
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in splitPlayer");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

duoPubgRouters.get("/getSplitPlayer" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.aggregate([
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
          .catch(error=>{console.log('error in  duo admin in aggregate in getSplitPlayer');console.log(error);
            res.status(200).json({round:0,data:[]});
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in getSplitPlayer");
      console.log(error);
      res.status(200).json({round:0,data:[]});
  })
});

duoPubgRouters.get("/getSplitPlayerNoConnect" ,checkAuth, (req,res)=>{
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
        res.status(200).json(duoSplitPlayers);
      }
  })
  .catch(error =>{
      console.log("error in duo admin in getSplitPlayerNoConnect");
      console.log(error);
      res.status(201).json([]);
  })
});

duoPubgRouters.get("/deleteSplitPlayers" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOneAndUpdate(
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
                duoSplitPlayers = [];
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in deleteSplitPlayers');console.log(error);
              res.status(201).json({message:"error occur"});
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in deleteSplitPlayers");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

duoPubgRouters.get("/sPFromDatabaseToServer" ,checkAuth, (req,res)=>{ //hAW mean hackers and winners
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
        duoPubgChampionship.aggregate([
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
                  groupPlayers.push({pubgIdTeamLeader:subElement.pubgIdTeamLeader , pubgIdMember:subElement.pubgIdMember});
                }
                SplitPlayersServer.push({
                  date:element.date,
                  time:element.time,
                  groupPlayers:groupPlayers
                })
              }
              duoSplitPlayers = SplitPlayersServer;
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
          .catch(error=>{console.log('error in  duo admin in aggregate in sPFromDatabaseToServer');console.log(error);
          res.status(200).json({
            message:"error occur"
          });
        });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in sPFromDatabaseToServer");
      console.log(error);
      res.status(200).json({
        message:"error occur"
      });
  })
});

duoPubgRouters.get("/getLastHackersWinnersRound" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.aggregate([
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
          .catch(error=>{console.log('error in  duo admin in aggregate in getLastHackersWinnersRound');console.log(error);
          res.status(200).json({round:0,realHacker:[] , winnersPubgId:[]});
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in getLastHackersWinnersRound");
      console.log(error);
      res.status(200).json({round:0,realHacker:[] , winnersPubgId:[]});
  })
});

duoPubgRouters.get("/getRegisterHackers" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOne(
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
            .catch(error=>{console.log('error in  duo admin in findOne in getRegisterHackers');console.log(error);
              res.status(201).json([]);
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in getRegisterHackers");
      console.log(error);
      res.status(201).json([]);
  })
});

duoPubgRouters.post("/getEmailHacker" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.aggregate([
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
                      {$eq: [ "$$players.pubgIdMember" ,idPubg ]},
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
              else if(data[0].HackerData[0].pubgIdMember == idPubg){
                res.status(200).json({
                  message:data[0].HackerData[0].emailMember
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
          .catch(error=>{console.log('error in  duo admin in aggregate in getEmailHacker');console.log(error);
          res.status(200).json({
            message:"error occur"
          });
        });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in getEmailHacker");
      console.log(error);
      res.status(200).json({
        message:"error occur"
      });
  })
});

duoPubgRouters.post("/addHackersAndWinners" ,checkAuth, (req,res)=>{
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
        let hackersAndWinnersData = req.body.data;
        duoPubgChampionship.findOneAndUpdate(
          {
            endDate:"no date added",
          },
          {
              $push: { realHackerAndWinnersPubg: { $each: [hackersAndWinnersData] } }
          },
          {
            runValidators: true,
            projection: { "_id" : 0, "endDate" : 1 }
          }).then(data=>{
            if(data != null){
              let hackers = [];
              for (let index = 0; index < hackersAndWinnersData.realHacker.length; index++) {
                const element = hackersAndWinnersData.realHacker[index];
                hackers.push(element.hackerPubgId);
              }
              duoReportHacke = hackers;
              duoWinnersPubg = hackersAndWinnersData.winnersPubgId;
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
          .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in addHackersAndWinners');console.log(error);
          res.status(200).json({
            message:"error occur"
          });
        });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in addHackersAndWinners");
      console.log(error);
      res.status(200).json({
        message:"error occur"
      });
  })
});


duoPubgRouters.get("/getReportHackers" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.aggregate([
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
            .catch(error=>{console.log('error in  duo admin in aggregate in getReportHackers');console.log(error);
              res.status(201).json([]);
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in getReportHackers");
      console.log(error);
      res.status(201).json([]);
  })
});


duoPubgRouters.get("/getReportHackersNoConnect" ,checkAuth, (req,res)=>{
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
        res.status(200).json(duoReportHacke);
      }
  })
  .catch(error =>{
      console.log("error in duo admin in getReportHackersNoConnect");
      console.log(error);
      res.status(201).json([]);
  })
});

duoPubgRouters.get("/getWinnersPubg" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.aggregate([
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
            .catch(error=>{console.log('error in  duo admin in aggregate in getWinnersPubg');console.log(error);
              res.status(201).json([]);
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in getWinnersPubg");
      console.log(error);
      res.status(201).json([]);
  })
});

duoPubgRouters.get("/getWinnersPubgNoConnect" ,checkAuth, (req,res)=>{
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
        res.status(200).json(duoWinnersPubg);
      }
  })
  .catch(error =>{
      console.log("error in duo admin in getWinnersPubgNoConnect");
      console.log(error);
      res.status(201).json([]);
  })
});

duoPubgRouters.get("/deleteHackersAndWinners" ,checkAuth, (req,res)=>{
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
        duoPubgChampionship.findOneAndUpdate(
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
                duoReportHacke = [];
                duoWinnersPubg = [];
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
            .catch(error=>{console.log('error in  duo admin in findOneAndUpdate in deleteHackersAndWinners');console.log(error);
              res.status(201).json({message:"error occur"});
          });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in deleteHackersAndWinners");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

duoPubgRouters.get("/hAWFromDatabaseToServer" ,checkAuth, (req,res)=>{ //hAW mean hackers and winners
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
        duoPubgChampionship.aggregate([
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
              duoReportHacke = data[0].hackersPubgIdData;
              duoWinnersPubg = data[0].winnersPubgIdData;
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
          .catch(error=>{console.log('error in  duo admin in aggregate in hAWFromDatabaseToServer');console.log(error);
          res.status(200).json({
            message:"error occur"
          });
        });
      }
  })
  .catch(error =>{
      console.log("error in duo admin in hAWFromDatabaseToServer");
      console.log(error);
      res.status(200).json({
        message:"error occur"
      });
  })
});



/* test */

duoPubgRouters.get("/testaddDuo" ,checkAuth, (req,res)=>{
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
        let players = [];
          for (let index = 0; index < 10000; index++) {
            players.push({emailTeamLeader:"mostafa"+index+"@gmail.com" ,pubgIdTeamLeader:"0000000"+index
            ,emailMember:"mostafa"+index+"@gmail.com" ,pubgIdMember:"0000000"+index , acceptPlayer:true})
          }
          duoPubgChampionship.findOneAndUpdate(
              {
                endDate:"no date added",
              },
              {
                $set: { "players": players }
              },
              {
                runValidators: true,
                projection: { "_id" : 0, "endDate" : 1 }
              }
            ).then(data=>{
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

  
module.exports = duoPubgRouters;