const mongoose = require('mongoose');

const soloPubgChampionship = mongoose.Schema({
    startDate:{type : String , required : true},
    endDate:{type : String , required : true , default: "no date added"  ,unique: true , index: true },
    totalPlayersNumber:{type : Number , required : true , default:0},// 0 mean no limit of players number
    players:[{
        //userName:{type : String ,required : true,validate: /^[a-z]+(\s[a-z]+){2}?$/ },
        email:{type : String , required : true ,validate: /^[a-z0-9]+@gmail.com$/ },
        pubgId:{type : String , required : true ,validate: /^[0-9]+$/ , minlength: 7 ,
                maxlength: 15},
        displayedAd:{type : String },
    }],
    paidAds:[{ _id : mongoose.Types.ObjectId }],
    
    freeAds:{
        //startDate:{type : String , required : true , default: new Date()},
        registers:[{
            videoId:{type : String , required : true , validate: /^[a-zA-Z0-9_-]+$/},
            //userName:{type : String , required : true , validate: /^[a-z]+(\s[a-z]+){2}?$/},
            email:{type : String ,  required : true  ,validate: /^[a-z0-9]+@gmail.com$/},
            adAppearanceCountry:{type : String , required : true , default: "ALL" , validate: /^[A-Z]{2,3}$/},
            displayedAd:{type : String , required : true, default: "error occur"},
        }],
        adsWillAppear:[{
            videoId:{type : String , required : true , validate: /^[a-zA-Z0-9_-]+$/},
            viewsNumber:{type : Number , required : true , default: 0},
            //userName:{type : String , required : true , validate: /^[a-z]+(\s[a-z]+){2}?$/},
            email:{type : String , required : true ,validate: /^[a-z0-9]+@gmail.com$/},
            adAppearanceCountry:{type : String , required : true ,default: "ALL" , validate: /^[A-Z]{2,3}$/},
        }],
        //endDate:{type : String , required : true , default: "no date added"},
    },
    charityAds:[{
        videoId:{type : String , required : true , validate: /^[a-zA-Z0-9_-]+$/},
        viewsNumber:{type : Number , required : true ,default: 0},
        //companyName:{type : String , required : true ,default: "no name"},
        adAppearanceCountry:{type : String , required : true ,default: "ALL" , validate: /^[A-Z]{2,3}$/},
    }],
    registerChampionshipType:{type : Boolean , required : true , default: false},//the register sitll open or closed
    registerFreeAdsType:{type : Boolean , required : true , default: false},//the register sitll open or closed
    registerReportHackerType:{type : Boolean , required : true , default: false},//the register sitll open or closed
    appearHackerAndWinnersPubg:{type : Boolean , required : true , default: false},//the register sitll open or closed
    splitPlayersType:{type : Boolean , required : true , default: false},
    splitPlayers:[{
        round:{type : Number , required : true },
        data:[{
                groupNumber:{type : Number , required : true },
                groupPlayers:[{
                    pubgId:{type : String , required : true ,validate: /^[0-9]+$/ , minlength: 7 ,
                        maxlength: 15}
                }],
                date:{type : String , required : true ,validate: /^\d{1,2}\/\d{1,2}\/\d{4}$/},
                time:{type : Number , required : true , min:1, max: 24},
        }],
    }],
    registerHacker:[{
        email:{type : String , required : true  ,validate: /^[a-z0-9]+@gmail.com$/},
        driveId:{type : String , required : true  ,validate: /^https:\/\/drive.google.com\/+[a-zA-Z0-9/?=_-]+$/}
    }],
    realHackerAndWinnersPubg:[{
        round:{type : Number , required : true },
        realHacker:[{
            hackerPubgId:{type : String , required : true ,validate: /^[0-9]+$/ , minlength: 7 ,
                maxlength: 15},
            email:{type : String , required : true  ,validate: /^[a-z0-9]+@gmail.com$/},
        }],
        winnersPubgId:[{type : String , required : true ,validate: /^[0-9]+$/ , minlength: 7 ,
            maxlength: 15}]
    }],
    /*reportHacker:[{
        videoId:{type : String , required : true},
        email:{type : String , required : true  ,validate: /^[a-z0-9]+@gmail.com$/},
    }],*/
    blackList:[{
        email:{type : String , required : true ,validate: /^[a-z0-9]+@gmail.com$/},
        pubgId:{type : String , required : true ,validate: /^[0-9]+$/ , minlength: 7 ,
            maxlength: 15}
    }]
});

module.exports = mongoose.model('soloPubgChampionship',soloPubgChampionship);