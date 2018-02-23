const mysql = require('mysql');
const credentials = require('./config/mysqlCredentials');
const nodemailer = require('nodemailer');
const { USERNAME, PASSWORD } = require('./config/nodemailerConfig.js');
const pool = mysql.createPool(credentials);

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
                let sql = "SELECT ??, ?? AS ?? FROM ?? JOIN ?? on ?? = ?? AND ?? = ? WHERE ?? != ?";
                let inserts = ['events.*', 'events_subjects.subject', 'e_s_subj', 'events', 'events_subjects', 'events.subject', 'events_subjects.id', 'events.isActive', 1, 'events.facebookID', req.session.passport.user.id];
                sql = mysql.format(sql, inserts);
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
                let sql = "SELECT ??, ?? AS ?? FROM ?? JOIN ?? on ?? = ?? AND ?? = ?";
                let inserts = ['events.*', 'events_subjects.subject', 'e_s_subj', 'events', 'events_subjects', 'events.subject', 'events_subjects.id', 'events.isActive', 1];
                sql = mysql.format(sql, inserts);
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
        let sql = "SELECT ??, ?? AS ?? FROM ?? JOIN ?? on ?? = ?? WHERE ?? = ? AND ?? = ?";
        let inserts = ['events.*', 'events_subjects.subject', 'e_s_subj', 'events', 'events_subjects', 'events.subject', 'events_subjects.id', 'isActive', 1, 'facebookID', req.session.passport.user.id];
        sql = mysql.format(sql, inserts);
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
                            const output = {
                                success: true,
                                data: results
                            };
                            res.end(JSON.stringify(output));
                        }
                    )
                });
        });

        //Start Nodemailer: Email for Event CREATED
        const subjArray = ["Life Sciences", "Visual and Performance Arts", "Liberal Arts", "Engineering and Technology", "Business"];
        const nodeMailSubj = subjArray[`${req.body.subject}` - 1];
        const mailOptions = {
            from: '"Stubbies: Find Your Study Buddies!" <studies.with.stubbies@gmail.com>',
            to: `${req.body.email}`,
            subject: 'Study Group Created!',
            html: `
                <div style='background-color: white; text-align: center; font-family: tahoma'>
                <p><img src="http://i66.tinypic.com/nzkq47.png"></p>
                <span><i>You don't have to study lonely, with Stubbies!</i></span>
                <hr>
                    <div style='text-align: left'>
                    <h2>Here are the details of your study group!</h2>
                    <p><b>${req.body.title}</b> will take place on <b>${req.body.date}</b> at <b>${req.body.time}</b>.</p>
                    <p><b>Where:</b> ${req.body.location}</p>
                    <p><b>Description:</b> ${req.body.description}</p>
                    <p><b>Duration:</b> ${req.body.duration}</p>
                    <p><b>Subject:</b> ${nodeMailSubj}</b></p>
                    <p><b>Group Size:</b> ${req.body.max}</p>
                    <p><b>Phone Provided:</b> ${req.body.phone}</p>
                    <p><b>Email Provided:</b> ${req.body.email}</p>
                    </div>
                </div>
                `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {} else {}
        });
        //End Nodemailer
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

                    //Start Nodemailer: Email for Event DELETED
                    let email = require('./nodemailerTemplates/deletedEvent');
                    let mailOptions = email.deletedEvent(req);
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {} else {}
                    });
                    //End Nodemailer
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

                                //Start Nodemailer: Email for Event JOINED
                                let email = require('./nodemailerTemplates/joinedEvent');
                                let mailOptions = email.joinedEvent(req);
                                transporter.sendMail(mailOptions, (error, info) => {
                                    if (error) {} else {}
                                });
                                //End Nodemailer
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
            let sql = "SELECT ??, ??, ??, ?? AS ?? FROM ?? INNER JOIN ?? on ?? = ?? INNER JOIN ?? on ?? = ?? WHERE ?? = ? AND ?? != ? AND ?? = ?";
            let inserts = ['joined_events.*', 'events.*', 'events_subjects.id', 'events_subjects.subject', 'e_s_subj', 'events', 'joined_events', 'joined_events.event_id', 'events.event_id', 'events_subjects', 'events_subjects.id', 'events.subject', 'joined_events.facebookID', req.session.passport.user.id, 'events.facebookID', req.session.passport.user.id, 'isActive', 1]
            sql = mysql.format(sql, inserts);
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

                            //Start Nodemailer: Email for LEAVING Event
                            let email = require('./nodemailerTemplates/leftEvent');
                            let mailOptions = email.leftEvent(req);
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {} else {}
                            });
                            //End Nodemailer
                        }
                    )
                    if (err) throw err;
                }
            )
        });
    })

}