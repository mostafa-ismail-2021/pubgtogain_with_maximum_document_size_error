const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const adminRouters = require('./routes/admin');
const soloPubgRouters = require('./routes/soloPubg');
const duoPubgRouters = require('./routes/duoPubg');
const squadPubgRouters = require('./routes/squadPubg');
const paidAdsRouters = require('./routes/paidAds');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://mostafa:hUgvZboBGnHNiBCO@cluster0.32r7d.mongodb.net/user?retryWrites=true&w=majority',{ useFindAndModify: false ,useNewUrlParser: true , useUnifiedTopology: true,useCreateIndex:true})
 .then(()=>{console.log("connect to database")})
 .catch(()=>{console.log("error")});

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT , PATCH, DELETE, OPTIONS"
  );
  next();
});
app.use("/api/admin",adminRouters);
app.use("/api/solo",soloPubgRouters);
app.use("/api/duo",duoPubgRouters);
app.use("/api/squad",squadPubgRouters);
app.use("/api/paidads",paidAdsRouters);
const squadPubgChampionship = require('./models/squadPubgChampionship');
const checkAuth = require('./middleware/check-auth')
/*test*/
app.get("/api/addchampion",(req,res)=>{
  console.log("fff")
  const sendRegister = new squadPubgChampionship({
    startDate:"1/5/2005",
    totalPlayersNumber:1000,
    registerChampionshipType:true,
  });
  //sendRegister.paidAds.push({_id:mongoose.Types.ObjectId("5f71771fc849e82bb4fe2f32")},{_id:mongoose.Types.ObjectId("5f72b23c1851153a9859588f")},{_id:mongoose.Types.ObjectId("5f72b275147f7529fcda55be")})
  sendRegister.freeAds.adsWillAppear.push({videoId:"ZmapKzNOzws" , userName:"u u u" , email : "ssss@gmail.com"}/*, {videoId:"bEKksPd8rF0" , userName:"u l u" , email : "ss@gmail.com"}*/)
  sendRegister.charityAds.push({videoId:"oEihBb38IFk" , adAppearanceCountry:"EG"}, {videoId:"7FvP4pQnFn0" , adAppearanceCountry:"ALL"})
  //sendRegister.players.push({userName:"mostafa mostafa mostafa",email:"ejsj26@gmail.com" , pubgId:147852365 })
  sendRegister.blackList.push({email:"mostafa@gmail.com",pubgId:1478523699},{email:"ahmed@gmail.com",pubgId:3698521477})
  sendRegister.paidAds.push({_id:mongoose.Types.ObjectId("5f77f8cf217b6854c0847738")},{_id:mongoose.Types.ObjectId("5f77f9e0fdcb512bb8c9990f")},{_id:mongoose.Types.ObjectId("5f77fa7fee7bf24980c143e2")})
  sendRegister.freeAds.adsWillAppear.push({videoId:"ZmapKzNOzws" , userName:"u u u" , email : "ssss@gmail.com"}, {videoId:"bEKksPd8rF0" , userName:"u l u" , email : "ss@gmail.com"})
  sendRegister.charityAds.push({videoId:"oEihBb38IFk" , adAppearanceCountry:"EG"}, {videoId:"7FvP4pQnFn0" , adAppearanceCountry:"ALL"})
  //sendRegister.players.push({userNameTeamLeader:"mostafa mostafa mostafa",emailTeamLeader:"eeee@gmail.com" , pubgIdTeamLeader:147852365 , pubgIdMember:147852369})
  sendRegister.blackList.push({email:"mostafa@gmail.com",pubgId:1478523699},{email:"ahmed@gmail.com",pubgId:3698521477})
  //sendRegister.freeAds.registers.push({videoId:"mm" , userName:"smms" , email:"www"})
  sendRegister.splitPlayers.push({round:1,data:[{groupNumber:1,date:"1/1/2020",time:14,groupPlayers:[{pubgIdTeamLeader:123456782,pubgIdFirstMember:147741141,pubgIdSecondMember:147741142,pubgIdThirdMember:147741143},{pubgIdTeamLeader:456654556,pubgIdFirstMember:654456654,pubgIdSecondMember:789987789,pubgIdThirdMember:987789987}]},{groupNumber:2,date:"2/2/2020",time:18,groupPlayers:[{pubgIdTeamLeader:147741147,pubgIdFirstMember:258852258,pubgIdSecondMember:741147741,pubgIdThirdMember:852258852},{pubgIdTeamLeader:963369963,pubgIdFirstMember:321321321,pubgIdSecondMember:123123123,pubgIdThirdMember:147147147}]}]},{round:2,data:[{groupNumber:1,date:"1/1/2020",time:16,groupPlayers:[{pubgIdTeamLeader:523456782,pubgIdFirstMember:547741141,pubgIdSecondMember:547741142,pubgIdThirdMember:547741143},{pubgIdTeamLeader:556654556,pubgIdFirstMember:554456654,pubgIdSecondMember:589987789,pubgIdThirdMember:587789987}]},{groupNumber:2,date:"2/2/2020",time:23,groupPlayers:[{pubgIdTeamLeader:547741147,pubgIdFirstMember:558852258,pubgIdSecondMember:541147741,pubgIdThirdMember:552258852},{pubgIdTeamLeader:563369963,pubgIdFirstMember:521321321,pubgIdSecondMember:523123123,pubgIdThirdMember:547147147}]}]});
  //sendRegister.splitPlayers.push({round:1,data:[{groupNumber:1,date:"1/1/2020",time:16,groupPlayers:[{pubgId:123456782},{pubgId:456654556}]},{groupNumber:2,date:"2/2/2020",time:23,groupPlayers:[{pubgId:147741147},{pubgId:963369963}]}]},{round:2,data:[{groupNumber:1,date:"1/1/2020",time:14,groupPlayers:[{pubgId:523456782},{pubgId:556654556}]},{groupNumber:2,date:"2/2/2020",time:19,groupPlayers:[{pubgId:547741147},{pubgId:563369963}]}]});

  /*sendRegister.splitPlayers.data.push({groupNumber:1,date:"1/1/2020",day:"saterday",time:"5pm"});
  sendRegister.splitPlayers.data.groupPlayers({pubgId:123456789,pubgId:1478523699});*/
  sendRegister.save().catch(a=>console.log(a));
});

app.get("/api/addad",checkAuth,(req,res)=>{
  const sendRegister = new paidAds(
    {
      videoId:"7B1yMsXER8I",
      totalViews:1000,
      viewsNumber:3,
      companyName:"mostafa company",
      costByEGP:1000,
      adAppearanceCountry:"ALL"
  
    });console.log("oooo");
  sendRegister.save().catch(a=>console.log(a));

});


app.get("/api/addHackerWinners",(req,res)=>{
  squadPubgChampionship.findOneAndUpdate(
    {
      endDate:"no date added",
    },
    {
      $push: { "realHackerAndWinnersPubg": { $each: [ {round:1 , realHacker : [{hackerPubgId:"1478523698",email:"nhy@gmail.com"},{hackerPubgId:"7898521456",email:"iyyt@gmail.com"}] , winnersPubgId : ["1478525874","4569874859"]} ] } }
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
/*end test */








/*
async function getCharityAd(country)
{
  return new Promise(function(resolve, reject) {
    charitableAds.aggregate([
      {
        $match:
        {
          $expr:
          { 
            $or: [
              {$eq: [ "$adAppearanceCountry",  "ALL" ]},
              {$eq: [ "$adAppearanceCountry",  country ]},
            ]
          }
        }
      },
      {
        $sample: { size: 1 }
      },
      {
        $project:{
          _id:0,
          videoId:1,
          videoType:"nativecharity",
          adAppearanceCountry:1
        }
      }
    ]).then(data=>{resolve(data)})
      .catch(error => {console.log('error in function getCharityAd');console.log(error);resolve([])});

    // may be a heavy db call or http request?// successfully fill promise
  })  
}*/

module.exports= app;