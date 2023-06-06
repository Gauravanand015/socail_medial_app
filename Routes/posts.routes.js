const express = require("express");
const { authenticate } = require("../Middleware/authenticate");
const { UserModel } = require("../Models/users.model");
const { PostModel } = require("../Models/posts.model");
const postsRouter = express.Router();

postsRouter.get("/posts",async(req,res)=>{
    const postData = await PostModel.find();
    res.send(postData)
})

postsRouter.post("/posts",authenticate,async(req,res)=>{
    const userData = await UserModel.findOne({email:req.body.email})
    const {text,image,createdAt,likes,comments} = req.body;

    try {
        let dataPosted = new PostModel({
            user:userData._id,
            text,
            image,
            createdAt,
            likes,
            comments
        })
        await dataPosted.save()
        res.send("Data Posted")
    } catch (error) {
        console.log(error);
        res.send("Error while posting posts")
    }
})

postsRouter.patch("/posts/:id",authenticate,async(req,res)=>{
    const postId = await PostModel.findOne({_id:req.params.id})
    const {text,image} = req.body;

    try {
        let dataUpdate = await PostModel.findByIdAndUpdate({_id:postId._id},{text:text,image:image});
        res.send("Data Updated")
    } catch (error) {
        console.log(error);
        res.send("Error in patch route")
    }
})

postsRouter.delete("/posts/:id",authenticate,async(req,res)=>{
    const postId = await PostModel.findOne({_id:req.params.id})
    try {
        let dataUpdate = await PostModel.findByIdAndUpdate({_id:postId._id});
        res.send("Data deleted")
    } catch (error) {
        console.log(error);
        res.send("Error in delete route")
    }
})

postsRouter.post("/posts/:id/like",authenticate,async(req,res)=>{
    const postPostedByUser = await PostModel.find({user:req.body._id});
    let postId = postPostedByUser[0]._id;
    
    try {
        let likes = await PostModel.findByIdAndUpdate({_id:postId},{$push:{likes:req.params.id}});
        res.send("Someone Liked the post")
    } catch (error) {
        console.log(error);
        res.send("Error in like route")
    }
})

// postsRouter.post("/posts/:id/comment",authenticate,async(req,res)=>{
//     const postPostedByUser = await PostModel.find({user:req.body._id});
//     let postId = postPostedByUser[0]._id;
    
//     try {
//         let likes = await PostModel.findByIdAndUpdate({_id:postId},{$push:{comment:req.params.id}});
//         res.send("Someone Liked the post")
//     } catch (error) {
//         console.log(error);
//         res.send("Error in like route")
//     }
// })

module.exports = {
    postsRouter
}