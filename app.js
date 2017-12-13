var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    serveStatic = require('serve-static'),
    flash = require('connect-flash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    expressSession = require('express-session'),
    path = require('path'),
    User = require('./models/user'),
    app = express();

var User = require("./models/user"),
    Organization = require("./models/organization"),
    BudgetEvent = require("./models/budgetEvent")

var indexRoutes = require("./routes/index"),
    organizationRoutes = require("./routes/organizations"),
    budgetRoutes = require("./routes/budgetEvent")

mongoose.connect('mongodb://localhost/cis197_project')

app.use(serveStatic('views'))
app.use(express('public'))
app.use(bodyParser.urlencoded({extended: true}))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash())

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

app.use("/", indexRoutes);
app.use("/organizations", organizationRoutes);
app.use("/budget", budgetRoutes);

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
