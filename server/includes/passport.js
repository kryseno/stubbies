const FacebookStrategy = require('passport-facebook').Strategy;
const facebookCreds = require('../config/facebookCreds.js');
const mysql = require('mysql');
const credentials = require('../config/mysqlCredentials');
const pool = mysql.createPool(credentials);

module.exports = function(passport){
    passport.use(new FacebookStrategy(facebookCreds,
        function (accessToken, refreshToken, profile, callback) {
            let queryGenerator = require('./sql');
            let query = queryGenerator.getFacebookID(profile);
            pool.query(query, function(err, results, fields, next) {
                if (err) {
                    return next(err);
                }
                if (results.length === 0) {
                    let queryGenerator = require('./sql');
                    let query = queryGenerator.userIsLoggedIn(profile);
                    pool.query(query, function(err, results, fields, next) {
                        if (err) {
                            return next(err);
                        }
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