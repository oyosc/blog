import mongoose from 'mongoose'

module.exports = new mongoose.Schema({
    likeId: String, //喜欢的文章或者评论Id
    userId: String,
    createdTime: String,
    type: String, //0为文章,1为评论
})