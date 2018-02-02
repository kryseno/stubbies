const express = require('express');
const credentials = require('./config/mysql_credentials');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan'); // Logger middleware for terminal
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const { USERNAME, PASSWORD } = require('./config/nodemailerConfig.js');

const app = express();

// const routes = require('./routes/index');
// app.use('/', routes);
// const passportRoutes = require('./routes/passport');
// const dbtest = require('./routes/index');
// app.use('/', dbtest);

const passport = require('passport');
const session = require('express-session');

var facebook = {};

//bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use( bodyParser.json() );
app.use(cookieParser());

//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*' );
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

//Express
app.use(express.static(path.join(__dirname, "..", "client", "dist")));

//Morgan
app.use(morgan('dev'));

//Session
app.use(session({
    secret: 'ssshhhh',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport.js')(passport);
require('./api')(app, passport);
require('./auth')(app, passport);

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

// Listen
app.listen(4000,function(){
    console.log('the server is started on Port 4000');
});