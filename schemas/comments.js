import mongoose from 'mongoose'

module.exports = new mongoose.Schema({
    content: String,
    createdTime: String,
    likeHot: String,
    replyToUser: String,
    userName: String
})