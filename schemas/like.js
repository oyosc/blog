import mongoose from 'mongoose'

module.exports = new mongoose.Schema({
    likeId: String, //喜欢的文章或者评论Id
    userId: String,
    createdTime: String,
    status: String, //0为删除,1为正常
    type: String, //0为文章评论,1为回复评论
})