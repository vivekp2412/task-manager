const mongoose= require("mongoose");
const TaskSchema= new mongoose.Schema({
 description:{
    type:String,
    required:true,
 },
 completed:{
    type:Boolean,
    required:true,
    default:false
 },
 owner:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User"
 }
})
TaskSchema.pre("save",function(next){
    const task = this;
    console.log("task saved");
    next();
})
const task = mongoose.model('Task',TaskSchema);
module.exports= task;