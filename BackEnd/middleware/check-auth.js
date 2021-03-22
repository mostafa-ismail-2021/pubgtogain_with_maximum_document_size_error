const jwt = require('jsonwebtoken');
module.exports = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token , "very_secrit_this_should_be_longer_to_prevent_any_none_needed_access_and_keep_web_site_safe_fore_ever_dont_try_break_this");
        next();
    }
    catch(error){
        res.status(401).json({message: "auth failed!"});
    }
};