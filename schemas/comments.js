import mongoose from 'mongoose'

module.exports = new mongoose.Schema({
    content: String,
    createdTime: String,
    likeHot: Number,
    replyToId: String,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    articleId: {type: mongoose.Schema.Types.ObjectId, ref: 'Article'},
    type: String //0代表未审核，1代表已审核
})