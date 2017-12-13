var User = require('../models/user'),
    express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    middleware = require("../middleware")


// root route
router.get("/", middleware.isLoggedIn, function(req, res) {
  res.redirect('/organizations')
})

// show register page
router.get("/register", function(req, res) {
  res.render('register')
})

// handle sign up logic
router.post("/register", function(req, res) {
  var newUser = new User({username: req.body.username, name: req.body.name})
  User.register(newUser, req.body.password, function(err, user){
      if(err){
          console.log(err)
          res.redirect('/register')
      } else {
          passport.authenticate('local')(req, res, function(){
              console.log(user)
              res.redirect('/organizations')
          })
      }
  })
})

// show login form
router.get("/login", function(req, res) {
  res.render('login')
})

// handling login logic
router.post("/login", passport.authenticate('local',
  {
    successRedirect: '/organizations',
    failureRedirect: '/login'
  }), function(req, res){
})

// logout routes
router.get("/logout", function(req, res) {
  req.logout()
  res.redirect('/')
});

module.exports = router;
