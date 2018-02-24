const FacebookStrategy = require('passport-facebook').Strategy;
const facebookCreds = require('./facebookCreds.js');
const mysql = require('mysql');
const credentials = require('./mysqlCredentials');
const pool = mysql.createPool(credentials);

module.exports = function(passport){
    passport.use(new FacebookStrategy(facebookCreds,
        function (accessToken, refreshToken, profile, callback) {
            let sql = "SELECT * FROM ?? WHERE ?? = ?";
            let inserts = ['users', 'facebookID', profile.id];
            sql = mysql.format(sql, inserts);
    
            pool.query(sql, function(err, results, fields) {
                if (err) throw err;
    
                if (results.length === 0) {
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
            return callback(null, profile);
        }));
    
    passport.serializeUser(function(user, callback) {
        callback(null, user);
    });
    
    passport.deserializeUser(function(obj, callback) {
        callback(null, obj);
    });
}