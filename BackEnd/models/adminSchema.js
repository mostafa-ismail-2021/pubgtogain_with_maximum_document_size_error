const mongoose = require('mongoose');
const adminSchema = mongoose.Schema({
    email:{type:String , required : true , validate: /^[a-zA-Z0-9.]+@+[a-zA-Z]+.com$/ },
    password:{type:String , required : true }
})
module.exports = mongoose.model('adminSchema',adminSchema);