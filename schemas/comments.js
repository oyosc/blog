import mongoose from 'mongoose'

module.exports = new mongoose.Schema({
    content: String,
    createdTime: String,
    likeHot: String,
    replyToId: String,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    articleId: String
})