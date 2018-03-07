const express = require('express');
const path = require('path');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const { logErrors, errorHandler } = require('./errorLogs/handleError'); //created middleware for error handling
const fs = require('fs'); // file writing for logging errors and login info
const PORT = process.env.PORT || 4000;
const app = express();

//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*' );
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

//Express
app.use(express.urlencoded({ extended: false }));
app.use( express.json() );
app.use(express.static(path.join(__dirname, "..", "client", "dist")));

//Morgan: Logger middleware for terminal
app.use(morgan('dev'));

//Session
app.use(session({
    secret: 'ssshhhh',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);
require('./api')(app, passport);
require('./auth')(app, passport);

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

/* Error handdling middlewares. Placed at the end to catch all errors */
app.use(logErrors);
app.use(errorHandler);

// Listen
app.listen(PORT, function(){
    console.log(`the server is listening on port ${PORT}`);
});