const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('index'));
// Welcome Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);


 
module.exports = router;
