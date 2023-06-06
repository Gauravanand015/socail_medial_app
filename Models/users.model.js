const mongoose = require("mongoose");
const { PostModel } = require("./posts.model");

const userSchema = mongoose.Schema({
        name: String,
        email: String,
        password: String,
        dob: Date,
        bio: String,
        posts: [{ type: mongoose.Schema.ObjectId, ref: "post" }],
        friends: [{ type: mongoose.Schema.ObjectId, ref: "user" }],
        friendRequests: [{ type: mongoose.Schema.ObjectId, ref: "user" }]
})

const UserModel = mongoose.model("user",userSchema);

module.exports = {
    UserModel
}