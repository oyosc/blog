import mongoose from 'mongoose'

module.exports = new mongoose.Schema({
    name: String,
    createdTime: String,
    clickHot: String
})
