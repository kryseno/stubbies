const mysql = require('mysql');
const credentials = require('./config/mysqlCredentials');
const pool = mysql.createPool(credentials);

module.exports = function (app, passport) {

    app.get('/checkLogin',
        function (req, res) {
            if (req.session.passport === undefined) {
                res.json({
                    isLoggedIn: false
                });
            } else {
                let queryGenerator = require('./includes/sql');
                let query = queryGenerator.setUserLoggedIn(req);
                pool.query(query, function (err, results, fields) {
                    if (err) throw err;
                    res.json({
                        isLoggedIn: true
                    });
                });
            }
        }
    )

    app.get('/auth/facebook',
        passport.authenticate('facebook', {
            authType: 'rerequest',
            scope: ['email', 'public_profile']
        })
    );

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            failureRedirect: '/'
        }),
        function (req, res) {
            res.redirect('/profile');
        }
    );

    app.get('/logout',
        function (req, res) {
            res.redirect('/');
            let queryGenerator = require('./includes/sql');
            let query = queryGenerator.setUserLoggedOut(req);
            pool.query(query, function (err, results, fields) {
                if (err) throw err;
            })
            req.session.destroy();
        }
    );
}