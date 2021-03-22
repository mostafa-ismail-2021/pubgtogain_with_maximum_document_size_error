const express = require('express');
const soloPubgRouters = express.Router();
const soloPubgChampionship = require('../models/soloPubgChampionship');
const adminSchema = require('../models/adminSchema');
const paidAds = require('../models/paidAds');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const geoip = require('geoip-lite');
const checkAuth = require('../middleware/check-auth');
var charityAds = {};
var freeAds = {};
var soloSplitPlayers = [];
var soloReportHacke = [];
var soloWinnersPubg = [];
var apperHackerAndWinners = false;

function soloGetAdNoConnect(country){
    let sendData = {
      register : false,
      videoId : null,
      videoType : "noType",
      adAppearanceCountry:null
    }
    if(typeof freeAds !== 'undefined' && Object.keys(freeAds).length > 0 != 0 && (freeAds.ALL != undefined || freeAds[country] != undefined)){
      //let ad = freeAd[Math.floor(freeAd.length * Math.random())];
      if(freeAds.ALL != undefined && freeAds[country] != undefined){
        let AllCountery = ["ALL" , country];
        let adAppearanceCountry = AllCountery[Math.floor(AllCountery.length * Math.random())];
        let videoId = freeAds[adAppearanceCountry][Math.floor(freeAds[adAppearanceCountry].length * Math.random())]
        sendData={
          register : false,
          videoId : videoId,
          videoType : "noType",
          adAppearanceCountry:adAppearanceCountry
        }
      }
      else if(freeAds.ALL != undefined){
        let videoId = freeAds["ALL"][Math.floor(freeAds["ALL"].length * Math.random())];
        sendData={
          register : false,
          videoId : videoId,
          videoType : "noType",
          adAppearanceCountry:"ALL"
        }
      }
      else{
        let videoId = freeAds[country][Math.floor(freeAds[country].length * Math.random())];
        sendData={
          register : false,
          videoId : videoId,
          videoType : "noType",
          adAppearanceCountry:country
        }
      }
    }
    else{
      if(charityAds.ALL != undefined && charityAds[country] != undefined){
        let AllCountery = ["ALL" , country];
        let adAppearanceCountry = AllCountery[Math.floor(AllCountery.length * Math.random())];
        let videoId = charityAds[adAppearanceCountry][Math.floor(charityAds[adAppearanceCountry].length * Math.random())]
        sendData={
          register : false,
          videoId : videoId,
          videoType : "noType",
          adAppearanceCountry:adAppearanceCountry
        }
      }
      else if(charityAds.ALL != undefined){
        let videoId = charityAds["ALL"][Math.floor(charityAds["ALL"].length * Math.random())];
        sendData={
          register : false,
          videoId : videoId,
          videoType : "noType",
          adAppearanceCountry:"ALL"
        }
      }
      else{
        let videoId = charityAds[country][Math.floor(charityAds[country].length * Math.random())];
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

soloPubgRouters.post("/sendEmailConfirm",(req ,res)=>{
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

soloPubgRouters.put('/increaseVideo',(req,res)=>{
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
      soloPubgChampionship.updateOne(
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
      soloPubgChampionship.updateOne(
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
      res.status(200).json(false);
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

soloPubgRouters.post("/registerGetAd", (req,res)=>{
    let country = undefined ;
    if(req.body.ip != undefined){
      let conuntryData = geoip.lookup(req.body.ip);
      if(conuntryData != null){
        country = conuntryData.country;
      }
    }
    /*soloPubgChampionship.aggregate([
      {
        $match: {endDate: "no date added"}
      },
      {
        $lookup: {
          from: "paidads",
          localField: "paidAds._id",    // field in the orders collection
          foreignField: "_id",  // field in the items collection
          as: "paidVideoId"
        }/*
          $lookup:
        {
          from: "paidads",
          let: { totalviews: "$totalViews", viewsnumber: "$viewsNumber" ,adAppearanceCountry: "$adAppearanceCountry" ,id:"$_id"},
  
          pipeline: [
              { $match:
                { $expr:
                    { $and:
                      [
                        { $eq: [ "$paidAds._id",  "$$id" ] },
                        //{ $in: ["$$adAppearanceCountry", [country,"ALL"]] },
                        //{ $gt: [ "$$totalviews", "$$viewsnumber" ] }
                      ]
                    }
                }
              },
              { 
                $project: {
                  _id: 0,
                  videoId:1,
                }
              }
          ],
          as: "paidVideoId"
       }
  
      },
      {
        $project:{
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
                  { $eq: [ "$registerChampionshipType",  true ] },
                ]
                
              },
              then: true,
              else: false
            }
          },
          ads:{
            $cond: {
              if: {
                $and : [
                  {$gt: [ {$size: { $ifNull: [ "$paidVideoId", [] ] }}, 0 ]},
                  {$gt: [ "$paidVideoId.totalViews", "$paidVideoId.viewsNumber" ]},
                  {$gt: ["$paidVideoId.totalViews", 100] },
                ],
              },
              then: {videoId:5/*
                videoId:"$paidVideoId.videoId[0]",
                videoType:"paid",
                country:"$paidVideoId.adAppearanceCountry"
              },
              else: {videoId:"$paidVideoId.totalViews"/*
                $cond: {
                  if:{
                    $gt: [ {$size: { $ifNull: [ "$freeAds.adsWillAppear", [] ] }}, 0 ]
                  },
                  then: {
                    videoId:"$freeAds.adsWillAppear.videoId",
                    videoType:"free"
                  },
                  else:{
                    videoId:"$charityAds.videoId",
                    videoType:"charity"
                  }
                }
              }
            }
          }
        } 
      }
    ])*/
    if(mongoose.connection.readyState == 1){
        
      soloPubgChampionship.aggregate([
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
                    { $eq: [ "$registerChampionshipType",  true ] },
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
            /*
            paidVideos:1,
            "freeAds.adsWillAppear":1,
            charityAds:1,
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
                    { $eq: [ "$registerChampionshipType",  true ] },
                  ]
                  
                },
                then: true,
                else: false
              }
            },
            paidAdsType:{
              $cond: {
                if: {
                  $gt: [ {$size: { $ifNull: [ "$paidVideos", [] ] }}, 0 ],
                },
                then: true,
                else: false
              }
            }*/
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
                  
                  /*videoId:"$paidVideos.videoId",
                      videoType:"paid",*/
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
            /*
            "ads.videoId.videoId":1,
            "ads.videoType":1
            */
          }
        }
        /*{
          $unwind: {path: "$paidVideos", preserveNullAndEmptyArrays: true}
        },
        /*{
          $match: {
            paidAdsType: {
              $cond: {
                if: {
                  $ne: [ { $ifNull: [ "$paidVideos", "not exist" ] },"not exist" ],
                },
                then: {
                  $and: [ 
                    { $gt: [ "$paidVideos.totalViews", "$paidVideos.viewsNumber" ]},
                    { $in: [ "$paidVideos.adAppearanceCountry", [ country , "ALL" ] ]}
                  ]
                }
              } 
            }
          }
        },
        { 
          $group : { 
            _id : "$register", 
            paidVideoId: { 
              $push: "$title" 
            }
          }
        },
        {
          $project:{
            _id:0,
            register:"$_id",
            ads:{
              $cond: {
                if: {
                  $ne: [ { $ifNull: [ "$data.paidVideo", "not exist" ] },"not exist" ],
                },
                then: {
                  videoId:"$paidVideos.videoId",
                  videoType:"paid",
                },
                else: {
                  $cond: {
                    if:{
                      $gt: [ {$size: { $ifNull: [ "$freeAds.adsWillAppear", [] ] }}, 0 ]
                    },
                    then: {
                      videoId:"$freeAds.adsWillAppear.videoId",
                      videoType:"free"
                    },
                    else:{
                      videoId:"$charityAds.videoId",
                      videoType:"charity"
                    }
                  }
                }
              }
            }
          } 
        }*/
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
          sendData = soloGetAdNoConnect(country);
        }
        res.status(200).json(sendData);
      })
      .catch(error => {
        console.log("error solo register get ad");
        console.log(error);
        /*let videoId = charityAds[country][Math.floor(charityAds[country].length * Math.random())];
          sendData={
            register : false,
            videoId : videoId,
            videoType : "noType",
            adAppearanceCountry:country
          }*/
        let sendData = soloGetAdNoConnect(country);
        res.status(200).json(sendData);
      });
    }
    /*else if(mongoose.connection.readyState == 0){
      let sendData = {
        register : false,
        videoId : "jvQ0Jt0EisI",
        videoType : "noType",
        adAppearanceCountry:"ALL"
      }
      res.status(200).json(sendData);
    }*/
    else{
      let sendData = soloGetAdNoConnect();
      res.status(200).json(sendData);
      /*let sendData = {
        register : false,
        videoId : null,
        videoType : "noType",
        adAppearanceCountry:null
      }
      if(Object.keys(freeAds).length > 0 != 0 && (freeAds.ALL != undefined || freeAds[country] != undefined)){
        //let ad = freeAd[Math.floor(freeAd.length * Math.random())];
        if(freeAds.ALL != undefined && freeAds[country] != undefined){
          let AllCountery = ["ALL" , country];
          let adAppearanceCountry = AllCountery[Math.floor(AllCountery.length * Math.random())];
          let videoId = freeAds[adAppearanceCountry][Math.floor(freeAds[adAppearanceCountry].length * Math.random())]
          sendData={
            register : false,
            videoId : videoId,
            videoType : "noType",
            adAppearanceCountry:adAppearanceCountry
          }
          res.status(200).json(sendData);
        }
        else if(freeAds.ALL != undefined){
          let videoId = freeAds["ALL"][Math.floor(freeAds["ALL"].length * Math.random())];
          sendData={
            register : false,
            videoId : videoId,
            videoType : "noType",
            adAppearanceCountry:"ALL"
          }
          res.status(200).json(sendData);
        }
        else{
          let videoId = freeAds[country][Math.floor(freeAds[country].length * Math.random())];
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
        if(charityAds.ALL != undefined && charityAds[country] != undefined){
          let AllCountery = ["ALL" , country];
          let adAppearanceCountry = AllCountery[Math.floor(AllCountery.length * Math.random())];
          let videoId = charityAds[adAppearanceCountry][Math.floor(charityAds[adAppearanceCountry].length * Math.random())]
          sendData={
            register : false,
            videoId : videoId,
            videoType : "noType",
            adAppearanceCountry:adAppearanceCountry
          }
          res.status(200).json(sendData);
        }
        else if(charityAds.ALL != undefined){
          let videoId = charityAds["ALL"][Math.floor(charityAds["ALL"].length * Math.random())];
          sendData={
            register : false,
            videoId : videoId,
            videoType : "noType",
            adAppearanceCountry:"ALL"
          }
          res.status(200).json(sendData);
        }
        else{
          let videoId = charityAds[country][Math.floor(charityAds[country].length * Math.random())];
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
    //});
    /*.populate({path: 'paidAds', match: {
      $in: ["$adAppearanceCountry", [country,"ALL"]],
      $gt: [ "$totalViews", "$viewsNumber" ] }})*/
    
    /*let allAd = Object.keys(payAd);
    if(allAd.length != 0){
      let ad = allAd[Math.floor(allAd.length * Math.random())];
      paidAndCharitableAds.findOneAndUpdate( { videoId : ad }, { $inc: { viewsNumber: 1 } }, { upsert : true , new: true, useFindAndModify: false })
      .then(selectedAd=>{
        if(selectedAd.viewsNumber >= payAd[selectedAd.videoId])
        {
          delete payAd[selectedAd.videoId];
          myAd.deleteOne({ videoId: selectedAd.videoId })
          .then(a=>{});
          soloPubgChampionship.find().then(user=>{
            res.status(200).json({
              countUser:user.length,
              videoId:selectedAd.videoId
            });
          });
        }
        else{
          soloPubgChampionship.find().then(user=>{
            res.status(200).json({
              countUser:user.length,
              videoId:selectedAd.videoId
            });
          });
        }
      });
    }
    else{
      let ad = freeAd[Math.floor(freeAd.length * Math.random())];
      soloPubgChampionship.find().then(user=>{
        res.status(200).json({
          countUser:user.length,
          videoId:ad
        });
      });
    }*/
});
  
  
/*
app.get("/api/checksolousername",(req,res)=>{
  
  let userName = req.query.username;
  soloPubgChampionship.aggregate([
    {
      $match:
        { 
          $and:
          [
            {endDate:"no date added"},
            {"players.userName": userName}
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
  .catch(error=>{console.log("error in checksolousername");console.log(error); res.status(200).json({acceptData:false,error:true,oldUserName:userName});});
});
*/
soloPubgRouters.get("/checkGmail",(req,res)=>{
    let gmailaccount = req.query.gmailaccount;
    soloPubgChampionship.aggregate([
      { 
        $match:
          { $and:
            [
              {endDate:{ $eq: "no date added"}},
              {
                $or: [
                  {"players.email":{ $eq: gmailaccount}},
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
    .catch(error=>{console.log("error in checksologmailaccount");console.log(error); res.status(200).json({acceptData:false,error:true,oldGmail:gmailaccount});});
});
  
soloPubgRouters.get("/checkIdPubg",(req,res)=>{
    let idPubg = req.query.idpubg;
    soloPubgChampionship.aggregate([
      {
        $match:
          { $and:
            [
              {endDate:{ $eq: "no date added"}},
              {
                $or: [
                  {"players.pubgId":{ $eq: idPubg}},
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
    .catch(error=>{console.log("error in checksoloidpubg");console.log(error); res.status(200).json({acceptData:false,error:true,oldIdPubg:idPubg});});
});
  
soloPubgRouters.post("/sendData",(req ,res)=>{
    soloPubgChampionship.aggregate([
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
                  { $eq: [ "$registerChampionshipType",  true ] },
                ]
                
              },
              then: true,
              else: false
            }
          }
        }
      }
    ]).then(register=>{
      if(register.length > 0 /*&& req.body.userName != undefined*/ && req.body.email != undefined && req.body.pubgId != undefined){
        if(register[0].register == true){
          /*const player = new soloPubgChampionship({
            UserName:req.body.userName,
            Email:req.body.email,
            Pubg:req.body.pubg,
          });
          sendRegister.save();*/
          if(req.body.videoId == undefined)
          {
            req.body.videoId = "error occur";
          }
          let idPubg = req.body.pubgId;
          soloPubgChampionship.findOneAndUpdate(
            {
              endDate:"no date added",
              "players.email": { $not: { $in: [req.body.email] } },
             /*"players.userName": { $not: { $in: [req.body.userName] } },
             "players.email": { $not: { $in: [req.body.email] } },
             "players.pubgId": { $not: { $in: [idPubg] } }*/
            },
            {
              $push: { players: { $each: [ { email : req.body.email , pubgId : idPubg , displayedAd : req.body.videoId} ] } }
            },
            {
              runValidators: true,
              projection: { "_id" : 0, "registerChampionshipType" : 1 }
            }
          ).then(data=>{
            if(data != null && data.registerChampionshipType){
              res.status(201).json({message:"your Registration in championShip is done"});
            }
            else{
              console.log('error in  SendData in findOneAndUpdate in nModified');
              res.status(201).json({message:"an error occur please register again"});
            }
          })
          .catch(error=>{console.log('error in  SendData in findOneAndUpdate');console.log(error);res.status(201).json({message:"error because overloads of server. register after some minutes when overloads of server go down"});});
          
          /*
          player.players.push({userName:req.body.userName,email:req.body.email , pubgId:req.body.pubgId})
          player.save().then(data=>{res.status(201).json({message:"your registred is done"});})
                        .catch(error=>{res.status(201).json({message:"an error occur please register again"});});
          */
  
        }
        else{
          res.status(201).json({message:"sorry register is finished"});
        }
      }
      else{console.log('error in  solo SendData in aggregate in undefinde data');
        res.status(201).json({message:"an error occur please register again"});
      }
    }).catch(error=>{console.log('error in  SendData in aggregate');console.log(error); res.status(201).json({message:"error because overloads of server. register after some minutes when overloads of server go down"});});
});
  
soloPubgRouters.post("/dateGetAd", (req,res)=>{  //re mean register
    let country = undefined ;
    if(req.body.ip != undefined){
      let conuntryData = geoip.lookup(req.body.ip);
      if(conuntryData != null){
        country = conuntryData.country;
      }
    }
    if(mongoose.connection.readyState == 1){
      soloPubgChampionship.aggregate([
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
      ]).then(data =>{console.log(data);
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
          let tempData = soloGetAdNoConnect(country);
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
        console.log("error solo det date get ad");
        console.log(error);
        let tempData = soloGetAdNoConnect(country);
        let sendData = {
          dateAppearance : false,
          videoId : tempData.videoId,
          videoType : tempData.videoType,
          adAppearanceCountry:tempData.adAppearanceCountry
        }
        if(typeof soloSplitPlayers !== 'undefined' && soloSplitPlayers.length != 0)
        {
          sendData.dateAppearance = true;
        }
        res.status(200).json(sendData);
       });
    }
    else{
      let tempData = soloGetAdNoConnect(country);
      let sendData = {
        dateAppearance : false,
        videoId : tempData.videoId,
        videoType : tempData.videoType,
        adAppearanceCountry:tempData.adAppearanceCountry
      }
      if(typeof soloSplitPlayers !== 'undefined' && soloSplitPlayers.length != 0)
      {
        sendData.dateAppearance = true;
      }
      res.status(200).json(sendData);
    }
});
  
soloPubgRouters.get("/getPlayerDate",(req,res)=>{
    let idPubg = req.query.idpubg;
    if(mongoose.connection.readyState == 1){
      soloPubgChampionship.aggregate([
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
                      $in: [idPubg , "$$filterData.groupPlayers.pubgId"]
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
          time:null,
          message:null
        }
        if(data.length != 0 ){
          if(data[0].data.date.length != 0 /*&& data[0].data.day.length != 0 */&& data[0].data.time.length != 0)
          {
            date = {
              date:data[0].data.date[0],
              time:data[0].data.time[0],
              message:'your next round will start in'
            }
          }
          else{
            date  = {
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
        console.log('error in getsoloplayerdate');
        console.log(error);
        let date  = {
          date : null,
          time:null,
          message:'the idPubg not exist'
        }
        if(typeof soloSplitPlayers !== 'undefined' && soloSplitPlayers.length != 0)
        {
          for (let index = 0; index < soloSplitPlayers.length; index++) {
            const element = soloSplitPlayers[index];
            if(typeof element.groupPlayers !== 'undefined' && element.groupPlayers.includes(idPubg))
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
        time:null,
        message:'the idPubg not exist'
      }
      if(typeof soloSplitPlayers !== 'undefined' && soloSplitPlayers.length != 0)
      {
        for (let index = 0; index < soloSplitPlayers.length; index++) {
          const element = soloSplitPlayers[index];
          if(typeof element.groupPlayers !== 'undefined' && element.groupPlayers.includes(idPubg))
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
 
soloPubgRouters.post("/freeAdGetAd", (req,res)=>{  //re mean register
    let country = undefined ;
    if(req.body.ip != undefined){
      country = geoip.lookup(req.body.ip).country;
    }
    if(mongoose.connection.readyState == 1){
      soloPubgChampionship.aggregate([
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
            /*{
              $cond: {
                if: {
                  $gt: [ {$size: { $ifNull: [ "$freeAds.adsWillAppear", [] ] }}, 0 ]
                },
                then: "freeAds.adsWillAppear",
                else: []
              }
            },*/
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
      ]).then(data =>{console.log(data);
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
          let tempData = soloGetAdNoConnect(country);
          sendData.videoId = tempData.videoId;
          sendData.videoType = tempData.videoType;
          sendData.adAppearanceCountry = tempData.adAppearanceCountry;
        }
        res.status(200).json(sendData);
      })
      .catch(error => {
        console.log('error in solofreeadgetad');
        console.log(error);
        let tempData = soloGetAdNoConnect(country);
        let sendData = {
          freeAdResgister : false,
          videoId : tempData.videoId,
          videoType : tempData.videoType,
          adAppearanceCountry:tempData.adAppearanceCountry,
          adsWillAppear:[]
        }
        if(typeof freeAds !== 'undefined')
        {
          let freeAdsWillAppear = [];
          let freeAdValues = Object.values(freeAds);
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
      let tempData = soloGetAdNoConnect(country);
      let sendData = {
        freeAdResgister : false,
        videoId : tempData.videoId,
        videoType : tempData.videoType,
        adAppearanceCountry:tempData.adAppearanceCountry,
        adsWillAppear:[]
      }
      if(typeof freeAds !== 'undefined')
      {
        let freeAdsWillAppear = [];
        let freeAdValues = Object.values(freeAds);
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

/* 
app.get("/api/checksolousernamefreead",(req,res)=>{
    let userName = req.query.username;
    soloPubgChampionship.aggregate([
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
    .catch(error=>{console.log("error in checksolousernamefreead");console.log(error); res.status(200).json({acceptData:false,error:true,oldUserName:userName});});
});
*/

soloPubgRouters.get("/checkGmailAccountFreeAd",(req,res)=>{
  
    let gmailaccount = req.query.gmailaccount;
    soloPubgChampionship.aggregate([
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
    .catch(error=>{console.log("error in checksologmailaccountfreead");console.log(error); res.status(200).json({acceptData:false,error:true,oldGmail:gmailaccount});});
});
  
soloPubgRouters.get("/checkYoutubeFreeAd",(req,res)=>{
    let youtube = req.query.youtube;
    soloPubgChampionship.aggregate([
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
    .catch(error=>{console.log("error in checksoloyoutubefreead");console.log(error); res.status(200).json({acceptData:false,error:true,oldYoutube:youtube});});
});
 
soloPubgRouters.post("/sendDataFreeAd",(req ,res)=>{
    soloPubgChampionship.findOneAndUpdate(
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
        console.log('error in  SendData in findOneAndUpdate in nModified');
        res.status(201).json({message:"an error occur please register again"});
      }
    })
    .catch(error=>{console.log('error in  SendData in findOneAndUpdate');console.log(error);;res.status(201).json({message:"error because overloads of server. register after some minutes when overloads of server go down"});});
}); 
  
soloPubgRouters.get("/reportHackerRegister", (req,res)=>{  //re mean register
    if(mongoose.connection.readyState == 1){
      soloPubgChampionship.aggregate([
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
            /*registerReportHackerType:1,
            appearHackerAndWinnersPubg:1,
            lastRound:{
              $cond: {
                if: {
                  $and: [
                    { 
                      $gt: [ {$size: { $ifNull: [ "$realHackerAndWinnersPubg", [] ] }}, 0 ]
                    },
                    { $eq: [ "$appearHackerAndWinnersPubg",  true ] },
                  ]
                },
                then:{
                  $slice: [ "$realHackerAndWinnersPubg", -1 ]
                },
                else:[]
              }
            }*/
          }
        }
        /*,
        {
          $unwind: {path: "$lastRound"}
        },
        {  
          $project : {
            hackerAppear:{
              $cond: {
                if: {
                  $gt: [ { $size: { $ifNull: [ "$lastRound.realHacker.hackerPubgId", [] ] } } , 0 ]
                },
                then: "$lastRound.realHacker.hackerPubgId",
                else: []
              }
            },
            winnersPubgAppear:{
              $cond: {
                if: {
                  $gt: [ { $size: { $ifNull: [ "$lastRound.winnersPubgId", [] ] } } , 0 ]
                },
                then: "$lastRound.winnersPubgId",
                else: []
              }
            },
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
        }*/
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
          sendData.apperHackerAndWinners = apperHackerAndWinners;
        }
        res.status(200).json(sendData);
      })
      .catch(error => {
        console.log('error in soloreporthackerregister');
        console.log(error);
        let sendData = {
          reportHackerResgister : false,
          apperHackerAndWinners : apperHackerAndWinners,
        };
        res.status(200).json(sendData);
      });
    }
    else{
      let sendData = {
        reportHackerResgister : false,
        apperHackerAndWinners : apperHackerAndWinners,
      };
      res.status(200).json(sendData);   
    }
});
 
soloPubgRouters.get("/checkGmailAccountHacker",(req,res)=>{
    let gmailaccount = req.query.gmailaccount;
    soloPubgChampionship.aggregate([
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
    .catch(error=>{console.log("error in checksologmailaccounthacker");console.log(error); res.status(200).json({acceptData:false,error:true,oldGmail:gmailaccount});});
});
  
soloPubgRouters.get("/checkGoogleDriveHacker",(req,res)=>{
    let googleDrive = req.query.googledrive;
    soloPubgChampionship.aggregate([
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
    .catch(error=>{console.log("error in checksologoogledrivehacker");console.log(error); res.status(200).json({acceptData:false,error:true,oldGoogleDrive:googleDrive});});
});
  
soloPubgRouters.post("/sendDataHacker",(req ,res)=>{
    soloPubgChampionship.findOneAndUpdate(
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
        console.log('error in solo SendDataHacker in findOneAndUpdate in nModified');
        res.status(201).json({message:"an error occur please register again"});
      }
    })
    .catch(error=>{console.log('error in solo SendDataHacker in findOneAndUpdate');console.log(error);;res.status(201).json({message:"error because overloads of server. register after some minutes when overloads of server go down"});});
}); 
  
soloPubgRouters.get("/getPlayerState",(req,res)=>{
    let idPubg = req.query.idpubg;
    if(mongoose.connection.readyState == 1){
      soloPubgChampionship.aggregate([
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
          if( typeof soloReportHacke !== 'undefined' && soloReportHacke.length != 0 && 
              typeof soloWinnersPubg !== 'undefined' && soloWinnersPubg.length != 0
            )
          {
            if(soloReportHacke.includes(idPubg))
            {
              message = 'you use hacker in last round';
            }
            else if(message == 'sorry you are not the winner in your group' && soloWinnersPubg.includes(idPubg))
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
        console.log('error in getsoloplayerstate');
        console.log(error);
        let message  = "sorry you are not the winner in your group";
        if( typeof soloReportHacke !== 'undefined' && soloReportHacke.length != 0 && 
              typeof soloWinnersPubg !== 'undefined' && soloWinnersPubg.length != 0
            )
          {
            if(soloReportHacke.includes(idPubg))
            {
              message = 'you use hacker in last round';
            }
            else if(message == 'sorry you are not the winner in your group' && soloWinnersPubg.includes(idPubg))
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
      if( typeof soloReportHacke !== 'undefined' && soloReportHacke.length != 0 && 
            typeof soloWinnersPubg !== 'undefined' && soloWinnersPubg.length != 0
          )
        {
          if(soloReportHacke.includes(idPubg))
          {
            message = 'you use hacker in last round';
          }
          else if(message == 'sorry you are not the winner in your group' && soloWinnersPubg.includes(idPubg))
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

soloPubgRouters.get("/getPagesState" ,checkAuth, (req,res)=>{
  soloPubgChampionship.findOne(
      { endDate: 'no date added' },
      {   _id: 0, 
          registerChampionshipType: 1, 
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
              registerChampionshipType:false,
              registerFreeAdsType:false,
              registerReportHackerType:false,
              appearHackerAndWinnersPubg:false,
              splitPlayersType:false
        });
      }else{
          res.status(200).json({
              exist:true,
              error:false,
              registerChampionshipType:data.registerChampionshipType,
              registerFreeAdsType:data.registerFreeAdsType,
              registerReportHackerType:data.registerReportHackerType,
              appearHackerAndWinnersPubg:data.appearHackerAndWinnersPubg,
              splitPlayersType:data.splitPlayersType
          });
      }
    })
  .catch(error=>{console.log("error in admin getSoloPagesState");console.log(error); 
      res.status(200).json({
          exist:false,
          error:true,
          registerChampionshipType:false,
          registerFreeAdsType:false,
          registerReportHackerType:false,
          appearHackerAndWinnersPubg:false,
          splitPlayersType:false
      });
  });
});

soloPubgRouters.get("/setChampionshipTypeTrue" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOneAndUpdate(
              {
                endDate:"no date added",
              },
              {
                  $set: { registerChampionshipType : true}
              },
              {
                runValidators: true,
                projection: { "_id" : 0, "registerChampionshipType" : 1 }
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
            .catch(error=>{console.log('error in  admin in findOneAndUpdate in setChampionshipTypeTrue');
                  console.log(error);
                  res.status(201).json({message:"error occure try again"});
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in setChampionshipTypeTrue");
      console.log(error);
      res.status(201).json({
          message:"error occure try again"
      });
  })
});

soloPubgRouters.get("/setFreeAdsTypeTrue" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  admin in findOneAndUpdate in registerFreeAdsType');console.log(error);
              res.status(201).json({message:"error occure try again"});
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in registerFreeAdsType");
      console.log(error);
      res.status(201).json({
          message:"error occure try again"
      });
  })
});

soloPubgRouters.get("/setReportHackerTypeTrue" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  admin in findOneAndUpdate in registerReportHackerType');console.log(error);
              res.status(201).json({message:"error occure try again"});
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in registerReportHackerType");
      console.log(error);
      res.status(201).json({
          message:"error occure try again"
      });
  })
});

soloPubgRouters.get("/setAppearHackerAndWinnersTrue" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOneAndUpdate(
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
                apperHackerAndWinners = true;
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
            .catch(error=>{console.log('error in  admin in findOneAndUpdate in appearHackerAndWinnersPubgTrue');console.log(error);
              res.status(201).json({message:"error occure try again"});
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in appearHackerAndWinnersPubgTrue");
      console.log(error);
      res.status(201).json({
          message:"error occure try again"
      });
  })
});

soloPubgRouters.get("/setSplitPlayersTypeTrue" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  admin in findOneAndUpdate in splitPlayersTypeTrue');console.log(error);
              res.status(201).json({message:"error occure try again"});
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in splitPlayersTypeTrue");
      console.log(error);
      res.status(201).json({
          message:"error occure try again"
      });
  })
});

soloPubgRouters.get("/setChampionshipTypeFalse" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOneAndUpdate(
              {
                endDate:"no date added",
              },
              {
                  $set: { registerChampionshipType : false}
              },
              {
                runValidators: true,
                projection: { "_id" : 0, "registerChampionshipType" : 1 }
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
            .catch(error=>{console.log('error in  admin in findOneAndUpdate in setChampionshipTypeFalse');
                  console.log(error);
                  res.status(201).json({message:"error occure try again"});
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in setChampionshipTypeFalse");
      console.log(error);
      res.status(201).json({
          message:"error occure try again"
      });
  })
});

soloPubgRouters.get("/setFreeAdsTypeFalse" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  admin in findOneAndUpdate in registerFreeAdsTypeFalse');console.log(error);
              res.status(201).json({message:"error occure try again"});
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in registerFreeAdsTypeFalse");
      console.log(error);
      res.status(201).json({
          message:"error occure try again"
      });
  })
});

soloPubgRouters.get("/setReportHackerTypeFalse" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  admin in findOneAndUpdate in registerReportHackerTypeFalse');console.log(error);
              res.status(201).json({message:"error occure try again"});
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in registerReportHackerTypeFalse");
      console.log(error);
      res.status(201).json({
          message:"error occure try again"
      });
  })
});

soloPubgRouters.get("/setAppearHackerAndWinnersFalse" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOneAndUpdate(
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
                apperHackerAndWinners = false;
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
            .catch(error=>{console.log('error in  admin in findOneAndUpdate in appearHackerAndWinnersPubgFalse');console.log(error);
              res.status(201).json({message:"error occure try again"});
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in appearHackerAndWinnersPubgFalse");
      console.log(error);
      res.status(201).json({
          message:"error occure try again"
      });
  })
});

soloPubgRouters.get("/setSplitPlayersTypeFalse" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  admin in findOneAndUpdate in splitPlayersTypeFalse');console.log(error);
              res.status(201).json({message:"error occure try again"});
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in splitPlayersTypeFalse");
      console.log(error);
      res.status(201).json({
          message:"error occure try again"
      });
  })
});

soloPubgRouters.post("/addChampion" ,checkAuth, (req,res)=>{
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
          const addNewSoloChampion = new soloPubgChampionship({
              startDate:req.body.startDate,
              totalPlayersNumber:req.body.totalPlayersNumber,
          });
          addNewSoloChampion.save()
          .then(data=>{
              res.status(200).json({
                  message:"championship added successfuly"
              });
          })
          .catch(error=>{
              console.log("error in admin in addChampion in save method");
              console.log(error)
              res.status(201).json({
                  message:"error occur"
              });
          });            
      }
  })
  .catch(error =>{
      console.log("error in admin in addChampion");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

soloPubgRouters.post("/endChampion" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  admin in findOneAndUpdate in endChampion');console.log(error);
              res.status(201).json({message:"error occur"});
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in endChampion");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

soloPubgRouters.post("/addCharityAds" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOneAndUpdate(
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
                charityAds = setCharityAds;
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
            .catch(error=>{console.log('error in  admin in findOneAndUpdate in addCharityAds');console.log(error);
              res.status(201).json({message:"error occur"});
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in addCharityAds");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

soloPubgRouters.get("/getCharityAds" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOne(
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
            .catch(error=>{console.log('error in  admin in findOne in getCharityAds');console.log(error);
              res.status(201).json([]);
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in getCharityAds");
      console.log(error);
      res.status(201).json([]);
  })
});

soloPubgRouters.get("/getCharityAdsServer" ,checkAuth, (req,res)=>{
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
        res.status(200).json(charityAds);
      }
  })
  .catch(error =>{
      console.log("error in admin in getCharityAdsServer");
      console.log(error);
      res.status(201).json({
        ads:{}
      });
  })
});

soloPubgRouters.get("/deleteCharityAds" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOneAndUpdate(
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
                charityAds = {};
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
            .catch(error=>{console.log('error in  admin in findOneAndUpdate in deleteCharityAds');console.log(error);
              res.status(201).json({message:"error occur"});
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in deleteCharityAds");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

soloPubgRouters.get("/CharityAdsFromDatabaseToServer" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOne(
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
                charityAds = setCharityAds;
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
            .catch(error=>{console.log('error in  admin in findOne in charityAdsFromDatabaseToServer');console.log(error);
            res.status(200).json({
              message:"error occur"
            });
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in charityAdsFromDatabaseToServer");
      console.log(error);
      res.status(200).json({
        message:"error occur"
      });
  })
});


soloPubgRouters.post("/addPaidAdsToServer" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  admin in findOneAndUpdate in addPaidAdsToServer');console.log(error);
              res.status(201).json({message:"error occur"});
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in addPaidAdsToServer");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});


soloPubgRouters.post("/addPaidAdToServer" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  admin in findOneAndUpdate in addPaidAdToServer');console.log(error);
            res.status(200).json({
              message:"error occur"
            });
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in addPaidAdToServer");
      console.log(error);
      res.status(200).json({
        message:"error occur"
      });
  })
});

soloPubgRouters.get("/getPaidAds" ,checkAuth, (req,res)=>{
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
            .catch(error=>{console.log('error in  admin in find in getPaidAds');console.log(error);
              res.status(201).json([]);
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in getPaidAds");
      console.log(error);
      res.status(201).json([]);
  })
});

soloPubgRouters.get("/getSoloPaidAds" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOne(
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
            .catch(error=>{console.log('error in  admin in findOne in getSoloPaidAds');console.log(error);
              res.status(201).json([]);
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in getSoloPaidAds");
      console.log(error);
      res.status(201).json([]);
  })
});

soloPubgRouters.get("/deletePaidAds" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  admin in findOneAndUpdate in deletePaidAds');console.log(error);
              res.status(201).json({message:"error occur"});
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in deletePaidAds");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

soloPubgRouters.post("/deletePaidAd" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  admin in findOneAndUpdate in deletePaidAd');console.log(error);
              res.status(201).json({message:"error occur"});
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in deletePaidAd");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

soloPubgRouters.post("/addBlackList" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  admin in findOneAndUpdate in addBlackList');console.log(error);
              res.status(201).json({message:"error occur"});
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in addBlackList");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

soloPubgRouters.get("/getBlackList" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOne(
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
            .catch(error=>{console.log('error in  admin in findOne in getBlackList');console.log(error);
              res.status(201).json([]);
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in getBlackList");
      console.log(error);
      res.status(201).json([]);
  })
});


soloPubgRouters.get("/deleteBlackList" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOneAndUpdate(
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
            .catch(error=>{console.log('error in  admin in findOneAndUpdate in deleteBlackList');console.log(error);
              res.status(201).json({message:"error occur"});
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in deleteBlackList");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

soloPubgRouters.get("/getRegisterAds" ,checkAuth, (req,res)=>{
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
        soloPubgChampionship.findOne(
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
            .catch(error=>{console.log('error in admin in aggregate in getRegisterAds');console.log(error);
              res.status(201).json([]);
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in getRegisterAds");
      console.log(error);
      res.status(201).json([]);
  })
});

soloPubgRouters.post("/addFreeAdToServer" ,checkAuth, (req,res)=>{
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
        soloPubgChampionship.findOneAndUpdate(
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
                if(freeAds.hasOwnProperty(adCountry)){
                  freeAds[adCountry].push(videoId);
                }
                else{
                  freeAds[adCountry] = [videoId];
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
            .catch(error=>{console.log('error in admin in findOneAndUpdate in addFreeAdToServer');console.log(error);
            res.status(200).json({
              message:"error occur"
            });
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in addFreeAdToServer");
      console.log(error);
      res.status(200).json({
        message:"error occur"
      });
  })
});

soloPubgRouters.get("/getAdsWillAppear" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.aggregate([
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
            .catch(error=>{console.log('error in  admin in aggregate in getAdsWillAppear');console.log(error);
              res.status(201).json([]);
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in getAdsWillAppear");
      console.log(error);
      res.status(201).json([]);
  })
});


soloPubgRouters.post("/addAdsWillAppear" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOneAndUpdate(
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
                freeAds = setFreeAds;
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
            .catch(error=>{console.log('error in  admin in findOneAndUpdate in addAdsWillAppear');console.log(error);
              res.status(201).json({message:"error occur"});
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

soloPubgRouters.get("/getRealAdsWillAppear" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOne(
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
            .catch(error=>{console.log('error in  admin in aggregate in getRealAdsWillAppear');console.log(error);
              res.status(201).json([]);
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in getRealAdsWillAppear");
      console.log(error);
      res.status(201).json([]);
  })
});

soloPubgRouters.get("/getAdsWillAppearserver" ,checkAuth, (req,res)=>{
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
        res.status(200).json(freeAds);
      }
  })
  .catch(error =>{
      console.log("error in admin in getAdsWillAppearserver");
      console.log(error);
      res.status(201).json({
        ads:{}
      });
  })
});

soloPubgRouters.get("/deleteAdsWillAppear" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOneAndUpdate(
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
                  freeAds = {};
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
            .catch(error=>{console.log('error in  admin in findOneAndUpdate in deleteAdsWillAppear');console.log(error);
              res.status(201).json({message:"error occur"});
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in deleteAdsWillAppear");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

soloPubgRouters.post("/deleteFreeAd" ,checkAuth, (req,res)=>{
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
        soloPubgChampionship.findOneAndUpdate(
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
              freeAds = setFreeAds;
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
            .catch(error=>{console.log('error in admin in findOneAndUpdate in deleteFreeAd');console.log(error);
              res.status(201).json({message:"error occur"});
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in deleteFreeAd");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

soloPubgRouters.get("/adsFromDatabaseToServer" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.aggregate([
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
                freeAds = setFreeAds;
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
            .catch(error=>{console.log('error in  admin in aggregate in adsFromDatabaseToServer');console.log(error);
            res.status(200).json({
              message:"error occur"
            });
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in adsFromDatabaseToServer");
      console.log(error);
      res.status(200).json({
        message:"error occur"
      });
  })
});

soloPubgRouters.get("/addPlayer" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOneAndUpdate(
            {
              endDate:"no date added",
            },
            {
              $push: { players: { $each: [ { email:"playtogain2020@gmail.com", pubgId:pubgId , displayedAd:"adminData"} ] } }
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
            .catch(error=>{console.log('error in  admin in findOneAndUpdate in addPlayer');console.log(error);
            res.status(200).json({
              message:"error occur"
            });
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in addPlayer");
      console.log(error);
      res.status(200).json({
        message:"error occur"
      });
  })
});


soloPubgRouters.get("/deletePlayer" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOneAndUpdate(
            {
              endDate:"no date added",
            },
            { $pull: { players: { pubgId: pubgId } } },
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
            .catch(error=>{console.log('error in  admin in findOneAndUpdate in deletePlayer');console.log(error);
            res.status(200).json({
              message:"error occur"
            });
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in deletePlayer");
      console.log(error);
      res.status(200).json({
        message:"error occur"
      });
  })
});

soloPubgRouters.get("/getPubgIds" ,checkAuth, (req,res)=>{
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
        soloPubgChampionship.findOne(
          { endDate: 'no date added' },
          {   _id: 0, 
              "players.pubgId": 1, 
          }
        ).then(data => {
          if(data != null ){
            res.status(200).json(data.players);
          }
          else{
            res.status(201).json([]);
          }
        })
        .catch(error=>{
          console.log('error in  admin in findOne in getPubgIds');console.log(error);
          res.status(201).json([]);
        });
      }
  })
  .catch(error =>{
      console.log("error in admin in getPubgIds");
      console.log(error);
      res.status(201).json([]);
  })
});

soloPubgRouters.post("/splitPlayer" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOneAndUpdate(
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
                soloSplitPlayers = [];
                for (let index = 0; index < playersData.length; index++) {
                  let element = playersData[index];
                  let pubgIds = [];
                  let pubgIdArray = playersData[index].groupPlayers;
                  for (let subIndex = 0; subIndex < pubgIdArray.length; subIndex++) {
                    let subElement = pubgIdArray[subIndex].pubgId;
                    pubgIds.push(subElement);
                  }
                  soloSplitPlayers.push({
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
            .catch(error=>{console.log('error in  admin in findOneAndUpdate in splitPlayer');console.log(error);
              res.status(201).json({message:"error occur"});
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in splitPlayer");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

soloPubgRouters.get("/getSplitPlayer" ,checkAuth, (req,res)=>{
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
        soloPubgChampionship.aggregate([
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
          .catch(error=>{console.log('error in  admin in aggregate in getSplitPlayer');console.log(error);
            res.status(200).json({round:0,data:[]});
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in getSplitPlayer");
      console.log(error);
      res.status(200).json({round:0,data:[]});
  })
});

soloPubgRouters.get("/getSplitPlayerNoConnect" ,checkAuth, (req,res)=>{
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
        res.status(200).json(soloSplitPlayers);
      }
  })
  .catch(error =>{
      console.log("error in admin in getSplitPlayerNoConnect");
      console.log(error);
      res.status(201).json([]);
  })
});

soloPubgRouters.get("/deleteSplitPlayers" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOneAndUpdate(
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
                soloSplitPlayers = [];
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
            .catch(error=>{console.log('error in  admin in findOneAndUpdate in deleteSplitPlayers');console.log(error);
              res.status(201).json({message:"error occur"});
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in deleteSplitPlayers");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

soloPubgRouters.get("/sPFromDatabaseToServer" ,checkAuth, (req,res)=>{ //hAW mean hackers and winners
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
        soloPubgChampionship.aggregate([
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
                  groupPlayers.push(subElement.pubgId);
                }
                SplitPlayersServer.push({
                  date:element.date,
                  time:element.time,
                  groupPlayers:groupPlayers
                })
              }
              soloSplitPlayers = SplitPlayersServer;
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
          .catch(error=>{console.log('error in  admin in aggregate in sPFromDatabaseToServer');console.log(error);
          res.status(200).json({
            message:"error occur"
          });
        });
      }
  })
  .catch(error =>{
      console.log("error in admin in sPFromDatabaseToServer");
      console.log(error);
      res.status(200).json({
        message:"error occur"
      });
  })
});

soloPubgRouters.get("/getLastHackersWinnersRound" ,checkAuth, (req,res)=>{
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
        soloPubgChampionship.aggregate([
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
          .catch(error=>{console.log('error in admin in aggregate in getLastHackersWinnersRound');console.log(error);
          res.status(200).json({round:0,realHacker:[] , winnersPubgId:[]});
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in getLastHackersWinnersRound");
      console.log(error);
      res.status(200).json({round:0,realHacker:[] , winnersPubgId:[]});
  })
});

soloPubgRouters.get("/getRegisterHackers" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOne(
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
            .catch(error=>{console.log('error in  admin in findOne in getRegisterHackers');console.log(error);
              res.status(201).json([]);
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in getRegisterHackers");
      console.log(error);
      res.status(201).json([]);
  })
});

soloPubgRouters.post("/getEmailHacker" ,checkAuth, (req,res)=>{
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
        soloPubgChampionship.aggregate([
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
                    $eq: [ "$$players.pubgId" ,req.body.idPubg ],
                  }
                }
              },
            }
          }
          ]).then(data=>{
            if(data.length != 0 && data[0].HackerData != 0){
              res.status(200).json({
                message:data[0].HackerData[0].email
              });
            }
            else{
              res.status(200).json({
                message:"this id not exist in championship"
              });
            }
          })
          .catch(error=>{console.log('error in  admin in aggregate in getEmailHacker');console.log(error);
          res.status(200).json({
            message:"error occur"
          });
        });
      }
  })
  .catch(error =>{
      console.log("error in admin in getEmailHacker");
      console.log(error);
      res.status(200).json({
        message:"error occur"
      });
  })
});

soloPubgRouters.post("/addHackersAndWinners" ,checkAuth, (req,res)=>{
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
        soloPubgChampionship.findOneAndUpdate(
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
              soloReportHacke = hackers;
              soloWinnersPubg = hackersAndWinnersData.winnersPubgId;
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
          .catch(error=>{console.log('error in  admin in findOneAndUpdate in addHackersAndWinners');console.log(error);
          res.status(200).json({
            message:"error occur"
          });
        });
      }
  })
  .catch(error =>{
      console.log("error in admin in addHackersAndWinners");
      console.log(error);
      res.status(200).json({
        message:"error occur"
      });
  })
});


soloPubgRouters.get("/getReportHackers" ,checkAuth, (req,res)=>{
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
        soloPubgChampionship.aggregate([
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
            .catch(error=>{console.log('error in  admin in aggregate in getReportHackers');console.log(error);
              res.status(201).json([]);
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in getReportHackers");
      console.log(error);
      res.status(201).json([]);
  })
});


soloPubgRouters.get("/getReportHackersNoConnect" ,checkAuth, (req,res)=>{
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
        res.status(200).json(soloReportHacke);
      }
  })
  .catch(error =>{
      console.log("error in admin in getReportHackersNoConnect");
      console.log(error);
      res.status(201).json([]);
  })
});

soloPubgRouters.get("/getWinnersPubg" ,checkAuth, (req,res)=>{
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
        soloPubgChampionship.aggregate([
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
            .catch(error=>{console.log('error in  admin in aggregate in getWinnersPubg');console.log(error);
              res.status(201).json([]);
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in getWinnersPubg");
      console.log(error);
      res.status(201).json([]);
  })
});

soloPubgRouters.get("/getWinnersPubgNoConnect" ,checkAuth, (req,res)=>{
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
        res.status(200).json(soloWinnersPubg);
      }
  })
  .catch(error =>{
      console.log("error in admin in getWinnersPubgNoConnect");
      console.log(error);
      res.status(201).json([]);
  })
});

soloPubgRouters.get("/deleteHackersAndWinners" ,checkAuth, (req,res)=>{
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
          soloPubgChampionship.findOneAndUpdate(
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
                  soloReportHacke = [];
                  soloWinnersPubg = [];
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
            .catch(error=>{console.log('error in  admin in findOneAndUpdate in deleteHackersAndWinners');console.log(error);
              res.status(201).json({message:"error occur"});
          });
      }
  })
  .catch(error =>{
      console.log("error in admin in deleteHackersAndWinners");
      console.log(error);
      res.status(201).json({
          message:"error occur"
      });
  })
});

soloPubgRouters.get("/hAWFromDatabaseToServer" ,checkAuth, (req,res)=>{ //hAW mean hackers and winners
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
        soloPubgChampionship.aggregate([
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
              soloReportHacke = data[0].hackersPubgIdData;
              soloWinnersPubg = data[0].winnersPubgIdData;
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
          .catch(error=>{console.log('error in  admin in aggregate in hAWFromDatabaseToServer');console.log(error);
          res.status(200).json({
            message:"error occur"
          });
        });
      }
  })
  .catch(error =>{
      console.log("error in admin in hAWFromDatabaseToServer");
      console.log(error);
      res.status(200).json({
        message:"error occur"
      });
  })
});



/* test */

soloPubgRouters.get("/testaddSolo" ,checkAuth, (req,res)=>{
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
            players.push({email:"mostafa"+index+"@gmail.com" ,pubgId:"0000000"+index})
          }
          soloPubgChampionship.findOneAndUpdate(
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

module.exports = soloPubgRouters;