const mysql = require('mysql');
const credentials = require('./config/mysqlCredentials');
const nodemailer = require('nodemailer');
const { USERNAME, PASSWORD } = require('./config/nodemailerConfig.js');
// const pool = mysql.createPool(credentials);

// nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: USERNAME,
        pass: PASSWORD
    }
});

module.exports = function (app, passport) {
    // Reading Events
    app.get('/events',
        function (req, res) {
            const connection = mysql.createConnection(credentials);
            if (req.session.passport !== undefined) {
                let sql = require('./config/sql');
                sql = sql.getEventsLoggedIn(req);
                connection.connect(() => {
                    connection.query(
                        sql,
                        function (err, results, fields) {
                            const output = {
                                success: true,
                                data: results
                            };
                            res.end(JSON.stringify(output));
                        });
                });
            } else {
                let sql = require('./config/sql');
                sql = sql.getEventsLoggedOut();
                connection.connect(() => {
                    connection.query(
                        sql,
                        function (err, results, fields) {
                            const output = {
                                success: true,
                                data: results
                            };
                            res.end(JSON.stringify(output));
                        });
                });
            }
        });

    // Grabbing User Events
    app.get('/user_events', function (req, res) {
        const connection = mysql.createConnection(credentials);
        let sql = require('./config/sql');
        sql = sql.getUserEventsCreated(req);
        connection.connect(() => {
            connection.query(
                sql,
                function (err, results, fields) {
                    const output = {
                        success: true,
                        data: results,
                        profile: req.session.passport
                    };
                    res.end(JSON.stringify(output));
                });
        });
    });

    // Adding Events
    app.post('/add_events', function (req, res) {
        const connection = mysql.createConnection(credentials);
        let sql = "INSERT INTO ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?";
        let inserts = ['events', 'title', req.body.title, 'description', req.body.description, 'subject', req.body.subject, 'date', req.body.date, 'time', req.body.time, 'duration', req.body.duration, 'location', req.body.location, 'max', req.body.max, 'phone', req.body.phone, 'email', req.body.email, 'coordinates', req.body.coordinates, 'facebookID', req.session.passport.user.id, 'isActive', 1];
        sql = mysql.format(sql, inserts);
        connection.connect(() => {
            connection.query(
                sql,
                function (err, results, fields) {
                    if (err) throw err;
                    let sql = "INSERT INTO ?? SET ?? = ?, ?? = ?";
                    let inserts = ['joined_events', 'facebookID', req.session.passport.user.id, 'event_id', results.insertId];
                    sql = mysql.format(sql, inserts);
                    connection.query(
                        sql,
                        function (err, results) {
                            if (err) throw err;
                            const output = {
                                success: true,
                                data: results
                            };
                            res.end(JSON.stringify(output));

                            //nodemailer
                            let email = require('./nodemailerTemplates/createdEvent');
                            let mailOptions = email.createdEvent(req);
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {} else {}
                            });
                        }
                    )
                });
        });
    });

    // Deleting Events
    app.post('/delete_events', function (req, res) {
        const connection = mysql.createConnection(credentials);
        let sql = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
        let inserts = ['events', 'isActive', 0, 'event_id', req.body.event_id];
        sql = mysql.format(sql, inserts);
        connection.connect(() => {
            connection.query(
                sql,
                function (err, results, fields) {
                    if (err) throw err;
                    const output = {
                        success: true,
                        data: results
                    };
                    res.end(JSON.stringify(output));

                    //nodemailer
                    let email = require('./nodemailerTemplates/deletedEvent');
                    let mailOptions = email.deletedEvent(req);
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {} else {}
                    });
                });
        });
    });

    // Joining Events
    app.post('/join_events', function (req, res) {
        const connection = mysql.createConnection(credentials);
        let sql = "SELECT * FROM ?? WHERE ?? = ?";
        let inserts = ['joined_events', 'event_id', req.body.event_id];
        sql = mysql.format(sql, inserts);
        connection.connect(() => {
            connection.query(
                sql,
                function (err, results) {
                    function insertUserIntoEvent() {
                        let sql = "INSERT INTO ?? SET ?? = ?, ?? = ?";
                        let inserts = ['joined_events', 'facebookID', req.session.passport.user.id, 'event_id', req.body.event_id];
                        sql = mysql.format(sql, inserts);
                        connection.query(
                            sql,
                            function (err, results) {
                                const output = {
                                    success: true,
                                    data: results
                                };
                                res.end(JSON.stringify(output));

                                //nodemailer
                                let email = require('./nodemailerTemplates/joinedEvent');
                                let mailOptions = email.joinedEvent(req);
                                transporter.sendMail(mailOptions, (error, info) => {
                                    if (error) {} else {}
                                });
                            }
                        )
                    }
                    if (err) throw err;
                    if (results.length == 0) {
                        insertUserIntoEvent();
                    } else if (results.length !== 0 && results.length < req.body.max - 1) {
                        let sql = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
                        let inserts = ['joined_events', 'event_id', req.body.event_id, 'facebookId', req.session.passport.user.id];
                        sql = mysql.format(sql, inserts);
                        connection.query(
                            sql,
                            function (err, results) {
                                if (results.length == 0) {
                                    insertUserIntoEvent();
                                } else {
                                    res.end('duplicate');
                                }
                            }
                        )
                    } else {
                        res.end("max")
                    }

                }
            )
        });
    })

    //Display events user joined
    app.get('/user_joined_events', function (req, res) {
            const connection = mysql.createConnection(credentials);
            let sql = require('./config/sql');
            sql = sql.getUserEventsJoined(req);
            connection.connect(() => {
                connection.query(
                    sql,
                    function (err, results) {
                        const output = {
                            success: true,
                            data: results
                        };
                        res.end(JSON.stringify(output))
                    }
                )
            })
        }

    );

    //Leaving Events from Profile Page
    app.post('/leave_event', function (req, res) {
        const connection = mysql.createConnection(credentials);
        let sql = "SELECT * FROM ?? WHERE ?? = ?";
        let inserts = ['joined_events', 'event_id', req.body.event_id];
        sql = mysql.format(sql, inserts);
        connection.connect(() => {
            connection.query(
                sql,
                function (err, results) {
                    let sql = "DELETE FROM ?? WHERE ?? = ? AND ?? = ?";
                    let inserts = ['joined_events', 'facebookID', req.session.passport.user.id, 'event_id', req.body.event_id];
                    sql = mysql.format(sql, inserts);
                    connection.query(
                        sql,
                        function (err, results) {
                            const output = {
                                success: true,
                                data: results
                            };
                            res.end(JSON.stringify(output));

                            //nodemailer
                            let email = require('./nodemailerTemplates/leftEvent');
                            let mailOptions = email.leftEvent(req);
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {} else {}
                            });
                        }
                    )
                    if (err) throw err;
                }
            )
        });
    })

}