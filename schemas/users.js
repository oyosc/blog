import mongoose from 'mongoose'

module.exports = new mongoose.Schema({
    username: String,
    password: String,
    type: Number // 0管理员，1普通用户
})