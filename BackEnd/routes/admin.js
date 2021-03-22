const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const adminRouters = express.Router();
const adminSchema = require('../models/adminSchema');
const mongoose = require('mongoose');

adminRouters.post("/login", (req,res)=>{
    if(mongoose.connection.readyState == 1){
        let adminData;
        adminSchema.find()
        .then(data => {
            if(data.length == 0)
            {
                bcrypt.hash("1997m+Os!Ta~Fa" , 10)
                .then(hash =>{
                    const admin = new adminSchema({
                        email:"noemail@email.com",
                        password:hash
                    });
                    admin.save()
                    .then(data =>{
                        return false
                    })
                    .catch(error =>{
                        console.log("error in login admin in create admin");
                        console.log(error)
                        return false
                    })
                })
            }
            else if(data[0].email == "noemail@email.com"){
                return false
            }
            else{
                if(data[0].email == req.body.email)
                {
                    adminData = data[0];
                    return bcrypt.compare(req.body.password , data[0].password);
                }
                else{
                    return false
                }
            }
        })
        .then(result =>{
            if(!result){
                return res.status(201).json({
                    createToken:false,
                    message:"auth failed",
                    expiresIn : 0
                });
            }
            const token = jwt.sign(
                {email:adminData.email , userId:adminData._id},
                "very_secrit_this_should_be_longer_to_prevent_any_none_needed_access_and_keep_web_site_safe_fore_ever_dont_try_break_this",
                {expiresIn:"168h"}
            );
            res.status(200).json({
                createToken:true,
                token:token,
                expiresIn : 604800
            });
        })
        .catch(error =>{
            console.log("error in login in find");
            console.log(error);
            return res.status(201).json({
                createToken:false,
                message:"auth failed",
                expiresIn : 0
            });
        })
    }
    else{
        res.status(201).json({
            createToken:false,
            message:"auth failed",
            expiresIn : 0
        });
    }
});

module.exports = adminRouters;