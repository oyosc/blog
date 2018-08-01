import mongoose from 'mongoose'

module.exports = new mongoose.Schema({
    username: String,
    password: String,
    type: Number, // 0管理员，1普通用户
    github_url: String, //github地址,
    github_name: String, //github用户名
    avatar: String //头像地址
})