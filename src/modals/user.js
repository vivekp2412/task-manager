const mongoose= require("mongoose");
const UserSchema =  new mongoose.Schema({ 
    name:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        require:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Not a valid email");
            }
        }
    },
    tokens:[{
        token:{
          type:String,
          required:true
        }
    }],
    password:{
        type:String,
        require:true,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error("invalid Password");
            }
        },
        min:7
    },
    avtar:{
        type:Buffer
    }
},{
    timestamps:true
})
const Task =  require("./task");
UserSchema.virtual("tasks",{
    ref:"Task",
    localField:"_id",
    foreignField:"owner"
})
const validator=require("validator");
const bcrypt =  require("bcryptjs");
UserSchema.pre("remove",async function(next){
    const user = this;
    await Task.deleteMany({owner:user._id});
    next();
})
UserSchema.pre("save", async function(next){
    const user= this;
    if(user.isModified('password')){
        console.log("password changeds")
        user.password = await bcrypt.hash(user.password,8);
        
    }
    next();
});
const jwt = require("jsonwebtoken");
UserSchema.methods.toJSON= function(){
    const user = this;
    const userObject  = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
   return userObject;
}
UserSchema.methods.generateAuthToken =  async function(){
 const user = this;
 const token = jwt.sign({id:user.id},process.env.KEY);
 user.tokens = user.tokens.concat({token});
 await user.save();
 return token;
}
UserSchema.statics.findByCredentials = async(email,password)=>{
const user = await User.findOne({email});
if(!user){
    throw new Error("User not found");
}
const match= await bcrypt.compare(password,user.password);
if(!match){
    throw new Error("Credential not found");
    

}
 return user;
}
const User = mongoose.model('User',UserSchema);
module.exports= User;