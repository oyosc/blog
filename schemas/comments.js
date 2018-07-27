import mongoose from 'mongoose'

module.exports = new mongoose.Schema({
    content: String,
    createdTime: String,
    clickHot: String
})