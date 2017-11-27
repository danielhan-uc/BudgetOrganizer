var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    serveStatic = require('serve-static'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    expressSession = require('express-session'),
    User = require('./models/user'),
    routes = require('./routes/routes.js'),
    app = express();

mongoose.connect('mongodb://localhost/cis197_project')

app.use(serveStatic('views'))
app.use(express('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')

app.use(expressSession({
    secret: 'cis197DanielHan',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(function(req, res, next){
    res.locals.currentUser = req.user
    next()
})

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.get('/', routes.get_home);
app.get('/secret', isLoggedIn, routes.get_secret);
app.get('/register', routes.get_register);
app.post('/register', routes.create_account);
app.get('/login', routes.get_login);
app.post('/login', passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login'
}), routes.check_login)
app.get('/logout', routes.get_logout)

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

/* Run the server */
console.log('Author: Daniel Han (hand)');
app.listen(8080);
console.log('Server running on port 8080. Now open http://localhost:8080/ in your browser!');
