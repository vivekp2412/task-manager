const express = require('express');
const Task = require("../modals/task");
const auth = require("../middleware/auth");
const task = require('../modals/task');
const router= express.Router();
//get task
router.get("/tasks",auth,async(req,res)=>{
//    const tasks =  await Task.find({owner:req.user._id});
      const match={};
      const sort={};
      if(req.query.completed){
        match.completed=req.query.completed;
      }
      if(req.query.sortBy){

          const part = req.query.sortBy.split(":");
          sort[part[0]]=part[1]=="asc"? 1 : -1;
      }
      await req.user.populate({
        path:'tasks',
        match,
        options:{
            limit:parseInt(req.query.limit),
            skip:parseInt(req.query.skip),
            sort
        }
      });
        res.send(req.user.tasks);
    
});
//get particular task
router.get("/task/:id",auth,async(req,res)=>{
    const id=req.params.id;
    
 Task.findOne({_id:id,owner:req.user._id}).then((task)=>{
        if(!task){
           return res.status(404).send("not found");
        }
        res.send(task)
        
    }).catch((e)=>{
        res.status(500).send();
    })
    // });
})
//add task
router.post("/task",auth,async (req,res)=>{
    const task =  new Task({
          ...req.body,
          owner:req.user.id
    });
    await task.save();
    res.send(task);
})
//update task
router.patch("/task/:id",auth,async(req,res)=>{
    const options = Object.keys(req.body);
    const properties = ["description","completed"];
    const isValid =  options.every((key)=>properties.includes(key));
    if(!isValid){
        res.status(400).send("invalid");
    }
    try{
        const updatedTask= await Task.findOne({_id:req.params.id,owner:req.user._id});
        if(!updatedTask){
            return res.status(400).send("not found");
        }
        options.forEach((key)=>{
            updatedTask[key]=req.body[key];
        });
        await updatedTask.save();
        res.send(updatedTask);
    }catch(e){
     console.log(e);
    }
})
//delete task
router.delete("/task/:id",auth,async (req,res)=>{
    try{
        const deletedUser = await Task.findOneAndDelete({_id:req.params.id});
        if(!deletedUser){
            res.status(400).send("User not Found")
        }
        res.status(200).send(deletedUser);
    }catch(e){
        res.send(e.message);
    }
})
module.exports=router;