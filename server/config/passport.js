const FacebookStrategy = require('passport-facebook').Strategy;
const facebookCreds = require('./config/facebookCreds.js');
const mysql = require('mysql');
const credentials = require('./config/mysql_credentials');
const pool = mysql.createPool(credentials);

module.exports = function(passport){
    passport.use(new FacebookStrategy(facebookCreds, // First argument accepts an object for clientID, clientSecret, and callbackURL
        function (accessToken, refreshToken, profile, cb) {
            let sql = "SELECT * FROM ?? WHERE ?? = ?";
            let inserts = ['users', 'facebookID', profile.id];
            sql = mysql.format(sql, inserts);
            console.log('this is the profile info form passport strat:', profile);
    
    
            pool.query(sql, function(err, results, fields) {
                if (err) throw err;
    
                if (results.length === 0) {
                    console.log('these are the results from passport strat:', results);
                    let { id, emails: [{value: emailVal}], name: { givenName , familyName}, photos: [{value: photoVal}] } = profile;
                    let isLoggedIn = 1;
    
                    let sql = "INSERT INTO ??(??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?)";
                    let inserts = ['users', 'facebookID', 'email', 'first_name', 'last_name', 'pictureURL', 'isLoggedIn',
                        id, emailVal, givenName, familyName, photoVal, isLoggedIn];
    
                    sql = mysql.format(sql, inserts);
    
                    pool.query(sql, function(err, results, fields) {
                        if (err) throw err;
                    });
                }
            });
            return cb(null, profile);
        }));
    
    passport.serializeUser(function(user, cb) {
        cb(null, user);
    });
    
    passport.deserializeUser(function(obj, cb) {
        cb(null, obj);
    });
}