import mongoose from 'mongoose'
import commentSchema from '../schemas/comments'

module.exports = mongoose.model('Comment', commentSchema, 'comment')
