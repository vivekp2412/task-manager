const express =  require("express");
const app =  express();
require("./db/mongoose.js");
const Task=require("./modals/task.js");
const User=require("./modals/user.js");
const env = require('env-cmd');
const userRoute = require('./route/user.js');
const taskRoute = require('./route/task.js');
const auth = require("./middleware/auth.js");
app.use(express.json());
// app.use(auth);
app.use(userRoute);
app.use(taskRoute);
app.listen(process.env.PORT,()=>{
    console.log(process.env.PORT);
    // console.log("Server connect at prot"+process.env.PORT);
})
// const jwt= require("jsonwebtoken");
// const myFunction=async()=>{
//     const json = await jwt.sign({id:"dkjkdj"},"key");
//     const match = jwt.verify(json,"key");
// }
// myFunction();
const main =async ()=>{
    const task =await Task.findById("64e84dbd875e016efc2032f0");
    const user =await User.findById("64e84d0a87f2d653c65d21e0");
    await user.populate("tasks");
    await task.populate('owner');
    console.log(task.owner);
    console.log(".............................................................");
    console.log(user.tasks);

}
// main();