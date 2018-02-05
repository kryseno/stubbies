const mysql = require('mysql');
const credentials = require('./config/mysqlCredentials');
const pool = mysql.createPool(credentials);

module.exports = function (app, passport) {
    // BEGIN ROUTING FOR PASSPORT AUTH
    app.get('/',
    // *** NOTHING IS HAPPENING HERE???? doesnt redirect here. goes to /checkLogin ***
        function (req, res) {
            //setting Login Status on DB
            const sess = req.session.passport.user.id;
            let isLoggedIn = 'isLoggedIn';
            let updateSql = `UPDATE users SET ${isLoggedIn} = 1 WHERE facebookID = ${sess}`;

            pool.query(updateSql, function (err, results, fields) {
                if (err) throw err;
            });

            //retrieving isLoggedIn status from DB
            let selectSql = `SELECT ${isLoggedIn} FROM users WHERE facebookID = ${sess}`;
            pool.query(selectSql, function (err, results, fields) {
                if (err) throw err;
            });
        }
    );

    app.get('/checkLogin',
        function (req, res) {
            //retrieving isLoggedIn status from passport data
            if (req.session.passport === undefined) {
                res.json({
                    isLoggedIn: false
                });
            } else {
                const sess = req.session.passport.user.id;
                // let selectSql = `SELECT isLoggedIn FROM users WHERE facebookID = ${sess}`; 
                    // ^ removed selectSql because it wasn't doing anything. wanted to update db with login status
                let isLoggedIn = 'isLoggedIn';
                let updateSql = `UPDATE users SET ${isLoggedIn} = 1 WHERE facebookID = ${sess}`;
                pool.query(updateSql, function (err, results, fields) {
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
            res.redirect('/');
        }
    );

    app.get('/logout',
        function (req, res) {
            res.redirect('/');

            //setting Login Status on DB
            const sess = req.session.passport.user.id;
            let isLoggedIn = 'isLoggedIn';
            let sql = `UPDATE users SET ${isLoggedIn} = 0 WHERE facebookID = ${sess}`;
            pool.query(sql, function (err, results, fields) {
                if (err) throw err;
            })

            req.session.destroy();
        }
    );
    // END ROUTING FOR PASSPORT AUTH
}

// *** function doesnt get called?? not in use? ***
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}