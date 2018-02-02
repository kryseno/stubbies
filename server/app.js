const express = require('express');
const path = require('path');
const morgan = require('morgan'); // Logger middleware for terminal
const app = express();
const passport = require('passport');
const session = require('express-session');

// const routes = require('./routes/index');
// app.use('/', routes);
// const passportRoutes = require('./routes/passport');
// const dbtest = require('./routes/index');
// app.use('/', dbtest);

//express
app.use(express.urlencoded({ extended: false }));
app.use( express.json() );

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