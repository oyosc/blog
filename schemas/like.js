import mongoose from 'mongoose'

module.exports = new mongoose.Schema({
    likeId: String, //喜欢的文章或者评论Id
    userName: String,
    createdTime: String,
    status: String //0为删除,1为正常
})