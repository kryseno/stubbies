const mysql = require("mysql");
const credentials = require("./config/mysqlCredentials");
const nodemailer = require("nodemailer");
const { USERNAME, PASSWORD } = require("./config/nodemailerConfig.js");

// nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: USERNAME,
    pass: PASSWORD
  }
});

module.exports = function(app, passport) {
//--------------------------JOIN EVENT PAGE--------------------------//
  //**************************************//
  //             Display Events           //
  //**************************************//
  app.get("/events", function(req, res) {
    const connection = mysql.createConnection(credentials);
    if (req.session.passport !== undefined) {
      let sql = require("./config/sql");
      sql = sql.getEventsLoggedIn(req);
      connection.connect(() => {
        connection.query(sql, function(err, results, fields) {
          if (err) throw err;
          const output = {
            success: true,
            data: results
          };
          res.end(JSON.stringify(output));
        });
      });
    } else {
      let sql = require("./config/sql");
      sql = sql.getEventsLoggedOut();
      connection.connect(() => {
        connection.query(sql, function(err, results, fields) {
          if (err) throw err;
          const output = {
            success: true,
            data: results
          };
          res.end(JSON.stringify(output));
        });
      });
    }
  });

  //**************************************//
  //             Joining Events           //
  //**************************************//
  app.post("/join_events", function(req, res) {
    const connection = mysql.createConnection(credentials);
    let sql = require("./config/sql");
    sql = sql.getJoinedEvents(req);
    connection.connect(() => {
      connection.query(sql, function(err, results) {
        if (err) throw err;
        function insertUserIntoEvent() {
          let sql = require("./config/sql");
          sql = sql.addUserToEvent(req);
          connection.query(sql, function(err, results) {
            if (err) throw err;
            const output = {
              success: true,
              data: results
            };
            res.end(JSON.stringify(output));

            //nodemailer
            let email = require("./nodemailerTemplates/joinedEvent");
            let mailOptions = email.joinedEvent(req);
            transporter.sendMail(mailOptions, (err, info) => {
              if (err) { console.log('error sending email notification') };
            });
          });
        }
        if (results.length === 0) {
          insertUserIntoEvent();
        } else {
          if (results.length == req.body.max) {
            res.end("max");
          } else {
            let sql = require("./config/sql");
            sql = sql.checkIfUserInEvent(req);
            connection.query(sql, function(err, results) {
              if (err) throw err;
              if (results.length === 0) {
                insertUserIntoEvent();
              } else {
                res.end("duplicate");
              }
            });
          }
        }
      });
    });
  });

//--------------------------CREATE EVENT PAGE--------------------------//
  //**************************************//
  //             Adding Events            //
  //**************************************//
  app.post("/add_events", function(req, res) {
    const connection = mysql.createConnection(credentials);
    let sql = require("./config/sql");
    sql = sql.addEvent(req);
    connection.connect(() => {
      connection.query(sql, function(err, results, fields) {
        if (err) throw err;
        let sql = require("./config/sql");
        sql = sql.addCreatorToEvent(req, results);
        connection.query(sql, function(err, results) {
          if (err) throw err;
          const output = {
            success: true,
            data: results
          };
          res.end(JSON.stringify(output));

          //nodemailer
          let sql = require("./config/sql");
          sql = sql.getSubject(req);
          connection.query(sql, function(err, subject) {
            if (err) throw err;
            let email = require("./nodemailerTemplates/createdEvent");
            let mailOptions = email.createdEvent(req, subject);
            transporter.sendMail(mailOptions, (err, info) => {
              if (err) { console.log('error sending email notification') };
            });
          });
        });
      });
    });
  });

//--------------------------PROFILE PAGE--------------------------//
  //**************************************//
  //      Display Events User Joined      //
  //**************************************//
  app.get("/user_joined_events", function(req, res) {
    const connection = mysql.createConnection(credentials);
    let sql = require("./config/sql");
    sql = sql.getUserEventsJoined(req);
    connection.connect(() => {
      connection.query(sql, function(err, results) {
        if (err) throw err;
        const output = {
          success: true,
          data: results
        };
        res.end(JSON.stringify(output));
      });
    });
  });

  //**************************************//
  //             Leaving Events           //
  //**************************************//
  app.post("/leave_event", function(req, res) {
    const connection = mysql.createConnection(credentials);
    let sql = require("./config/sql");
    sql = sql.getJoinedEvents(req);
    connection.connect(() => {
      connection.query(sql, function(err, results) {
        if (err) throw err;
        let sql = require("./config/sql");
        sql = sql.removeUserFromEvent(req);
        connection.query(sql, function(err, results) {
          if (err) throw err;
          const output = {
            success: true,
            data: results
          };
          res.end(JSON.stringify(output));

          //nodemailer
          let email = require("./nodemailerTemplates/leftEvent");
          let mailOptions = email.leftEvent(req);
          transporter.sendMail(mailOptions, (err, info) => {
            if (err) { console.log('error sending email notification') };
          });
        });
      });
    });
  });

  //**************************************//
  //      Display Events User Created     //
  //**************************************//
  app.get("/user_events", function(req, res) {
    const connection = mysql.createConnection(credentials);
    let sql = require("./config/sql");
    sql = sql.getUserEventsCreated(req);
    connection.connect(() => {
      connection.query(sql, function(err, results, fields) {
        if (err) throw err;
        const output = {
          success: true,
          data: results,
          profile: req.session.passport
        };
        res.end(JSON.stringify(output));
      });
    });
  });

  //**************************************//
  //             Deleting Events          //
  //**************************************//
  app.post("/delete_events", function(req, res) {
    const connection = mysql.createConnection(credentials);
    let sql = require("./config/sql");
    sql = sql.deleteEvent(req);
    connection.connect(() => {
      connection.query(sql, function(err, results, fields) {
        if (err) throw err;
        const output = {
          success: true,
          data: results
        };
        res.end(JSON.stringify(output));

        //nodemailer
        let email = require("./nodemailerTemplates/deletedEvent");
        let mailOptions = email.deletedEvent(req);
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) { console.log('error sending email notification') };
        });
      });
    });
  });
};