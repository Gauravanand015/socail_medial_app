const express = require("express");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const { UserModel } = require("../Models/users.model");
const { authenticate } = require("../Middleware/authenticate");
const userRouter = express.Router();

userRouter.post("/register",async(req,res)=>{
    const {name,email,password,dob,bio,posts,friends,friendRequests} = req.body;
    const userData = await UserModel.find({email:email});
    try {
        if (userData.length>0) {
            res.send("This email is already Registered!!")
        } else {
            bcrypt.hash(password, 8, async(err, hash)=>{
                let user = new UserModel({
                    name,
                    email,
                    password:hash,
                    dob,
                    bio,
                    posts,
                    friends,
                    friendRequests
                })

                await user.save();
                res.send("User Registered")
            });
        }
    } catch (error) {
        console.log(error);
        res.send("Error while registering Users")
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    const userData = await UserModel.find({email:email})

    try {
        if(userData.length>0){
            bcrypt.compare(password, userData[0].password,(err, result)=>{
                if(result){
                    const token = jwt.sign({ email: userData[0].email ,_id:userData[0]._id}, "ALPHA");
                    res.send({
                        "Message":"LOGIN SUCCESSFUL",
                        "TOKEN":token})
                }
                else{
                    console.log(err);
                    res.send("Password is wrong!!")
                }
            });
        }else{
            res.send("You Have to Register First")
        }
    } catch (error) {
        console.log(error);
        res.send("Error while Login")
    }
})

userRouter.get("/users",async(req,res)=>{
    let users = await UserModel.find();
    res.send(users)
})

userRouter.get("/users/:id/friends",async(req,res)=>{
    const friendsData = await UserModel.find({_id:req.params.id}).populate("friends").exec();
    res.send(friendsData)
})

// Send Friend Request Route
userRouter.post("/users/:id/friends",authenticate,async(req,res)=>{
    const friendId = req.params.id;
    const userData = await UserModel.findOne({email:req.body.email});
   try {
        if (userData) {
            const request = await UserModel.updateOne({_id:userData._id},{$push:{friendRequests:friendId}})
            res.send("Request Send")
        } else {
            res.send("InValid USER")
        }
   } catch (error) {
        console.log(error);
        res.send("Error in post friend request")
   }
})

// Friend Request Reject Route
userRouter.patch("/usersReject/:id/friends/:friendId",authenticate,async(req,res)=>{
    const friendRequestsId = req.params.friendId;
    const onlineUserId  = req.params.id;
    try {
        let userData = await UserModel.updateOne({_id:onlineUserId},{$pull:{friendRequests:friendRequestsId}})
        console.log(userData)
        res.send("Friend Request Rejected")
    } catch (error) {
        console.log(error);
        res.send("Error while rejecting request")
    }
})

// Friend Request Accept Route
userRouter.patch("/usersAccept/:id/friends/:friendId",authenticate,async(req,res)=>{
    const friendRequestsId = req.params.friendId;
    const onlineUserId  = req.params.id;
    try {
        let requestAccepted = await UserModel.updateOne({_id:onlineUserId},{$push:{friends:friendRequestsId}})
        let userData = await UserModel.updateOne({_id:onlineUserId},{$pull:{friendRequests:friendRequestsId}})
        res.send("Friend Request Accepted")
    } catch (error) {
        console.log(error);
        res.send("Error while accepting request")
    }
})

module.exports = {
    userRouter
}