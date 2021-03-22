const express = require('express');
const paidAdsRouters = express.Router();
const adminSchema = require('../models/adminSchema');
const paidAds = require('../models/paidAds');
const checkAuth = require('../middleware/check-auth');

  paidAdsRouters.post("/addPaidAd",checkAuth, (req,res)=>{
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
            let paidAd = req.body.paidAd;
            const addPaidAd = new paidAds({
              videoId:paidAd.videoId,
              totalViews:paidAd.totalViews,
              companyName:paidAd.companyName,
              costByEGP:paidAd.costByEGP,
              adAppearanceCountry:paidAd.adAppearanceCountry
            });
            addPaidAd.save()
            .then(data=>{
              res.status(200).json({
                message:"paid ad added successfuly"
              });
            })
            .catch(error=>{console.log('error in  admin in findOneAndUpdate in endChampion');console.log(error);
            res.status(200).json({
              message:"error occur"
            });
          });
        }
    })
    .catch(error =>{
        console.log("error in admin in endChampion");
        console.log(error);
        res.status(200).json({
          message:"error occur"
        });
    })
  });

  paidAdsRouters.get("/getPaidAds",checkAuth, (req,res)=>{
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
            paidAds.find()
            .then(data=>{
                if(data.length != 0){
                  res.status(200).json(data);
                }
                else{
                  res.status(200).json([]);
                }
              })
              .catch(error=>{console.log('error in  admin in findOneAndUpdate in endChampion');console.log(error);
              res.status(200).json([]);
            });
        }
    })
    .catch(error =>{
        console.log("error in admin in endChampion");
        console.log(error);
        res.status(200).json([]);
    })
  }); 

  paidAdsRouters.get("/getPaidAdsNot",checkAuth, (req,res)=>{
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
                { $expr: { $gt: [ "$totalViews" , "$viewsNumber" ] } }
            )
            .then(data=>{
                if(data.length != 0){
                  res.status(200).json(data);
                }
                else{
                  res.status(200).json([]);
                }
              })
              .catch(error=>{console.log('error in  admin in findOneAndUpdate in endChampion');console.log(error);
              res.status(200).json([]);
            });
        }
    })
    .catch(error =>{
        console.log("error in admin in endChampion");
        console.log(error);
        res.status(200).json([]);
    })
  }); 

  paidAdsRouters.post("/getPaidAdsCompany",checkAuth, (req,res)=>{
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
                { $expr: { $eq: [ "$companyName" , req.body.companyName ] } }
            )
            .then(data=>{
                if(data.length != 0){
                  res.status(200).json(data);
                }
                else{
                  res.status(200).json([]);
                }
              })
              .catch(error=>{console.log('error in  admin in findOneAndUpdate in endChampion');console.log(error);
              res.status(200).json([]);
            });
        }
    })
    .catch(error =>{
        console.log("error in admin in endChampion");
        console.log(error);
        res.status(200).json([]);
    })
  });

  paidAdsRouters.post("/deletePaidAd", (req,res)=>{
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
            paidAds.deleteOne(
              {
                _id:req.body._id,
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

module.exports = paidAdsRouters;