import mongoose from 'mongoose'
import likeSchema from '../schemas/like'

module.exports = mongoose.model('Like', likeSchema)
