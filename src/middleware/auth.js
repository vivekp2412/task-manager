const jwt = require('jsonwebtoken');
const User= require("../modals/user");
const auth =async(req,res,next)=>{
    try{
        const token = req.header("Authorization").replace('Bearer ','');
        // console.log(token)
        const match = jwt.verify(token,process.env.KEY);
        const user = await User.findOne({_id:match.id,'tokens.token':token});
        // console.log(user);
        if(!user){
            throw new Error("No user found");
        }
        req.user=user;
        req.token = token;
        next();
    }catch(e){
        res.send("please authenticate");
    }
}
module.exports = auth;