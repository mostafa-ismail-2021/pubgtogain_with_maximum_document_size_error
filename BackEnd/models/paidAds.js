const mongoose = require('mongoose');

const paidAds = mongoose.Schema({
    videoId:{type : String , require : true , validate: /^[a-zA-Z0-9_-]+$/},
    totalViews:{type : Number , require : true},
    viewsNumber:{type : Number , require : true ,default: 0},
    companyName:{type : String , require : true },
    costByEGP:{type : Number , require : true },
    //paidAd:{type : Boolean , require : true ,default: false},
    adAppearanceCountry:{type : String , require : true ,default: "ALL" , validate: /^[A-Z]{2,3}$/},
    //showAd:{type : Boolean , require : true , default: true},
    //informCompanyAdsOver:{type : Boolean , require : true ,default: false},
});

module.exports = mongoose.model('paidAds',paidAds);