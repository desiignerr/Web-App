const mongoose = require('mongoose');


const CommentSchema = new mongoose.Schema(

    {
    comment: {
        type: String,
     
   required: true
    },
    likes: {
        type: Number,
        required: true,
     
   default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
      
  required: true,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now
    }
}


);


const Comment = mongoose.model('User', CommentSchema);

module.exports = Comment;
