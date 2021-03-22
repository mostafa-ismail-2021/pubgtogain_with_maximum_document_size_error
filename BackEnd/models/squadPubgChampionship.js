const mongoose = require('mongoose');

const squadPubgChampionship = mongoose.Schema({
    startDate:{type : String , required : true},
    endDate:{type : String , required : true , default: "no date added"  ,unique: true , index: true },
    totalPlayersNumber:{type : Number , required : true , default:0},// 0 mean no limit of players number
    players:[{
        //userNameTeamLeader:{type : String ,required : true,validate: /^[a-z]+(\s[a-z]+){2}?$/ },
        emailTeamLeader:{type : String , required : true ,validate: /^[a-z0-9]+@gmail.com$/},
        pubgIdTeamLeader:{type : String , required : true ,validate: /^[0-9]+$/ , minlength: 7 ,
            maxlength: 15},
        displayedAdTeamLeader:{type : String , required : true , default: "error occur"},

        //userNameFirstMember:{type : String ,validate: /^[a-z]+(\s[a-z]+){2}?$/ ,required:true , default:"no name added"},
        emailFirstMember:{type : String , validate: /^[a-z0-9]+@gmail.com$/ ,required:true , default:"test@gmail.com"},
        pubgIdFirstMember:{type : String , required : true ,validate: /^[0-9]+$/ , minlength: 7 ,
            maxlength: 15},
        displayedAdFirstMember:{type : String ,required:true , default:"error occur"},
        acceptFirstPlayer:{type : Boolean ,required:true , default:false},

        //userNameSecondMember:{type : String ,validate: /^[a-z]+(\s[a-z]+){2}?$/ ,required:true , default:"no name added"},
        emailSecondMember:{type : String , validate: /^[a-z0-9]+@gmail.com$/ ,required:true , default:"test@gmail.com"},
        pubgIdSecondMember:{type : String , required : true ,validate: /^[0-9]+$/ , minlength: 7 ,
            maxlength: 15},
        displayedAdSecondMember:{type : String ,required:true , default:"error occur"},
        acceptSecondPlayer:{type : Boolean ,required:true , default:false},

        //userNameThirdMember:{type : String ,validate: /^[a-z]+(\s[a-z]+){2}?$/ ,required:true , default:"no name added"},
        emailThirdMember:{type : String , validate: /^[a-z0-9]+@gmail.com$/ ,required:true , default:"test@gmail.com"},
        pubgIdThirdMember:{type : String , required : true ,validate: /^[0-9]+$/ , minlength: 7 ,
            maxlength: 15},
        displayedAdThirdMember:{type : String ,required:true , default:"error occur"},
        acceptThirdPlayer:{type : Boolean ,required:true , default:false},
    }],
    paidAds:[{ _id : mongoose.Types.ObjectId }],
    
    freeAds:{
        startDate:{type : String , required : true , default: new Date()},
        registers:[{
            videoId:{type : String , required : true},
            //userName:{type : String , required : true , validate: /^[a-z]+(\s[a-z]+){2}?$/},
            email:{type : String ,  required : true ,validate: /^[a-z0-9]+@gmail.com$/},
            adAppearanceCountry:{type : String , required : true , default: "ALL"},
            displayedAd:{type : String , required : true, default: "error occur"},
        }],
        adsWillAppear:[{
            videoId:{type : String , required : true},
            viewsNumber:{type : Number , required : true , default: 0},
            //userName:{type : String , required : true , validate: /^[a-z]+(\s[a-z]+){2}?$/},
            email:{type : String , required : true ,validate: /^[a-z0-9]+@gmail.com$/},
            adAppearanceCountry:{type : String , required : true ,default: "ALL"},
        }],
        endDate:{type : String , required : true , default: "no date added"},
    },
    charityAds:[{
        videoId:{type : String , required : true},
        viewsNumber:{type : Number , required : true ,default: 0},
        //companyName:{type : String , required : true ,default: "no name"},
        adAppearanceCountry:{type : String , required : true ,default: "ALL"},
    }],
    registerTeamLeaderChampionshipType:{type : Boolean , required : true , default: false},//the register sitll open or closed
    registerMemberChampionshipType:{type : Boolean , required : true , default: false},
    registerFreeAdsType:{type : Boolean , required : true , default: false},//the register sitll open or closed
    registerReportHackerType:{type : Boolean , required : true , default: false},//the register sitll open or closed
    appearHackerAndWinnersPubg:{type : Boolean , required : true , default: false},
    splitPlayersType:{type : Boolean , required : true , default: false},
    splitPlayers:[{
        round:{type : Number , required : true },
        data:[{
                groupNumber:{type : Number , required : true },
                groupPlayers:[{
                    pubgIdTeamLeader:{type : String , required : true ,validate: /^[0-9]+$/ , minlength: 7 ,
                        maxlength: 15},
                    pubgIdFirstMember:{type : String , required : true ,validate: /^[0-9]+$/ , minlength: 7 ,
                        maxlength: 15},
                    pubgIdSecondMember:{type : String , required : true ,validate: /^[0-9]+$/ , minlength: 7 ,
                        maxlength: 15},
                    pubgIdThirdMember:{type : String , required : true ,validate: /^[0-9]+$/ , minlength: 7 ,
                        maxlength: 15},
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
    blackList:[{
        email:{type : String , required : true ,validate: /^[a-z0-9]+@gmail.com$/},
        pubgId:{type : String , required : true ,validate: /^[0-9]+$/ , minlength: 7 ,
            maxlength: 15},
    }]
    
});

module.exports = mongoose.model('squadPubgChampionship',squadPubgChampionship);