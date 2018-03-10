const express = require('express');
const path = require('path');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const morgan_common = ":remote-addr - :remote-user [:date[web]] ':method :url HTTP/:http-version' :status :res[content-length]";
const fs = require('fs');

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

//Morgan: error logger middleware
app.use(morgan(morgan_common, {
    stream: fs.createWriteStream(path.join('/home', 'ubuntu', 'serverError.log'), {flags: 'r+'}),
    skip: function(req, res){
        return res.statusCode < 400
    }
}));

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

// Listen
app.listen(PORT, function(){
    console.log(`the server is listening on port ${PORT}`);
});