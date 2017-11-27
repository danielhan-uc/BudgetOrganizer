var User = require('../models/user'),
    passport = require('passport'),
    LocalStrategy = require('passport-local')

var getHome = function(req, res) {
  res.render('home')
}

var getSecret = function(req, res) {
  res.render('secret')
}

var getRegister = function(req, res) {
  res.render('register')
}

var getLogin = function(req, res) {
  res.render('login')
}

var getLogout = function(req, res) {
  req.logout()
  res.redirect('/')
}

var createAccount = function(req, res) {
  var newUser = new User({username: req.body.username, name: req.body.name})
  User.register(newUser, req.body.password, function(err, user){
      if(err){
          console.log(err)
          res.redirect('/register')
      } else {
          passport.authenticate('local')(req, res, function(){
              console.log(user)
              res.redirect('/secret')
          })
      }
  })
}

var checkLogin = function(req, res) {

}

var routes = {
  get_home: getHome,
  get_secret: getSecret,
  get_register: getRegister,
  get_login: getLogin,
  get_logout: getLogout,
  create_account: createAccount,
  check_login: checkLogin
}

module.exports = routes;
