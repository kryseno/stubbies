const mysql = require('mysql');
const credentials = require('./config/mysqlCredentials');
const nodemailer = require('nodemailer');
const { USERNAME, PASSWORD } = require('./config/nodemailerConfig.js');

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
        let sql = require('./config/sql');
        sql = sql.addEvent(req);
        connection.connect(() => {
            connection.query(
                sql,
                function (err, results, fields) {
                    if (err) throw err;
                    let sql = require('./config/sql');
                    sql = sql.addCreatorToEvent(req, results);
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
                            let sql = require('./config/sql');
                            sql = sql.getSubject(req);
                            connection.query(
                                sql,
                                function(err, subject) {
                                    let email = require('./nodemailerTemplates/createdEvent');
                                    let mailOptions = email.createdEvent(req, subject);
                                    transporter.sendMail(mailOptions, (error, info) => {
                                        if (error) {} else {}
                                    });
                                }
                            )
                        }
                    )
                });
        });
    });

    // Deleting Events
    app.post('/delete_events', function (req, res) {
        const connection = mysql.createConnection(credentials);
        let sql = require('./config/sql');
        sql = sql.deleteEvent(req);
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
        let sql = require('./config/sql');
        sql = sql.getJoinedEvents(req);
        connection.connect(() => {
            connection.query(
                sql,
                function (err, results) {
                    function insertUserIntoEvent() {
                        let sql = require('./config/sql');
                        sql = sql.addUserToEvent(req);
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
                    if (results.length === 0) {
                        insertUserIntoEvent();
                    } else {
                        if (results.length == req.body.max) {
                            res.end('max');
                        } else {
                            let sql = require('./config/sql');
                            sql = sql.checkIfUserInEvent(req);
                            connection.query(
                                sql,
                                function (err, results) {
                                    if (results.length === 0) {
                                        insertUserIntoEvent();
                                    } else {
                                        res.end('duplicate');
                                    }
                                }
                            )
                        }
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
        let sql = require('./config/sql');
        sql = sql.getJoinedEvents(req);
        connection.connect(() => {
            connection.query(
                sql,
                function (err, results) {
                    if (err) throw err;
                    let sql = require('./config/sql');
                    sql = sql.removeUserFromEvent(req);
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
                }
            )
        });
    })

}