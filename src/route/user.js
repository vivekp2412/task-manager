const express = require('express');
const User=require('../modals/user');
const router = express.Router();
const auth =  require('../middleware/auth');
//add user
router.post("/user/signup",async (req,res)=>{
    const newUser = new User(req.body);
    try{
        const token =  newUser.generateAuthToken();
        // await newUser.save();
        res.status(201).send({newUser,token})
    }catch(e){
        console.log(e);
    }

    // newUser.tokens.concat({token});
    // console.log(req.body);
   
 });
 //get all users
 router.get("/user/me",auth,(req,res)=>{
     res.send(req.user);
 });
 //get particular user
 router.get("/user/:id",(req,res)=>{
     const id=req.params.id;
     User.findById(id).then((user)=>{
         if(!user){
            return res.status(404).send("not found");
         }
         res.send(user)
         
     })
 });
 //login
 router.post("/user/login",async(req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({user,token});

    }catch(e){
        res.send("error");
    }

 })
 //update user
 router.patch("/user/me",auth,async(req,res)=>{
     const options = Object.keys(req.body);
     const properties = ["name","email","password"];
     const isValid =  options.every((key)=>properties.includes(key));
     if(!isValid){
         res.status(400).send("invalid ")
     }
     try{
        const updatedUser= req.user;
        options.forEach((key)=>{
            updatedUser[key]=req.body[key];
        });
        await updatedUser.save();
        //  const updatedUser = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
         
         res.send(updatedUser);
     }catch(e){
      console.log(e);
     }
 })
//delete user
router.delete("/user/me",auth,async (req,res)=>{
    try{
        // const user = new User(req.user);
    await req.user.deleteOne();
     res.send("user"+req.user);
    }catch(e){
        res.send(e.message);
    }
})
router.post("/user/logout",auth,async (req,res)=>{
    try{
   req.user.tokens = req.user.tokens.filter((token)=>{
    return token.token !== req.token;
   });
   res.status(200).send("Logged out")
    }catch(e){
        res.send(e.message);
    }

})
router.post("/user/logout",auth,async (req,res)=>{
    try{
   req.user.tokens = req.user.tokens.filter((token)=>{
    return token.token !== req.token;
   });
   res.status(200).send("Logged out")
    }catch(e){
        res.send(e.message);
    }

})
router.post("/user/logoutall",auth,async (req,res)=>{
    try{
   req.user.tokens = [];
   res.status(200).send("Logged out")
    }catch(e){
        res.send(e.message);
    }

})
const multer = require('multer');
const upload = multer({
    // dest:"profiles",
    limits:{
        fileSize:1000000,
    },
    fileFilter(req,file,cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
});
const sharp = require('sharp');
router.post("/users/me/profile",auth,upload.single("upload"),async(req,res)=>{
    const avtar = await sharp(req.file.buffer).png().toBuffer();
    req.user.avtar= avtar;
    await req.user.save();
    res.send("Uploaded");
},(error,req,res,next)=>{
    res.status(400).send(error.message);
})
router.delete("/users/me/profile",auth,upload.single("upload"),async(req,res)=>{
    req.user.avtar= undefined;
    await req.user.save();
    res.send("Profile removed");
},(error,req,res,next)=>{
    res.status(400).send(error.message);
})
router.get("/user/:id/profile",upload.single("upload"),async(req,res)=>{
    try{
        const id =  req.params.id;
        const user = await User.findById(id);
        
        if(!user || !user.avtar){
            throw new Error("No Profile Found");
        }
        res.set("Content-Type","image/jpg");
        res.send(user.avtar);
    }catch(e){
        res.status(400).send(e.message);
    }
})
module.exports=router;