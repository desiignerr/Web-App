// paste this in your routes file

router.post('/post', ensureAuthenticated, (req, res) => {

    const { postID, userID, title, message } = req.body;
    let errors = [];
  
    if (!postID || !userID || !title || !message) {
      errors.push({ msg: 'Please enter all fields' });
    }
    if (errors.length > 0) {
        postID,
        userID,
        title,
        message
      
    } else {
          const newPostData = new PostData({
            postID,
            userID,
            title,
            message
          })
          newPostData
          .save()
          .then(() => {
            /* req.flash(
              'success_msg',
              'You are now registered and can log in'
          ) */
          console.log('Post submitted successfully...');
          res.redirect('/');
            })
            }
  
    
  });

  // create a new file in your model folder and name it Post.js
  // then paste this code inside it 
  const mongoose = require('mongoose');

const PostData = new mongoose.Schema({
  postID: {
    type: String,
    required: true
  },
  userID: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

const PostData = mongoose.model('PostData', PostDataSchema);

module.exports = PostData;