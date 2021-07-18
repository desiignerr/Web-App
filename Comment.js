const mongoose = require('mongoose');


const CommentSchema = new mongoose.Schema(




);


const Comment = mongoose.model('User', CommentSchema);

module.exports = Comment;
