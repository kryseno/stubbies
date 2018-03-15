const mysql = require("mysql");
const credentials = require("../config/mysqlCredentials");
const nodemailer = require("nodemailer");
const { USERNAME, PASSWORD } = require("../config/nodemailerConfig");

//nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: USERNAME,
    pass: PASSWORD
  }
});

module.exports = function(app, passport) {
  //**************************************//
  //             Display Events           //
  //**************************************//
  app.get("/events", function(req, res) {
    const connection = mysql.createConnection(credentials);
    if (req.session.passport !== undefined) {
      let queryGenerator = require("../includes/sql");
      let query = queryGenerator.getEventsLoggedIn(req);
      connection.connect(() => {
        connection.query(query, function(err, results, fields, next) {
          if (err) {
            return next(err);
          }
          const output = {
            success: true,
            data: results
          };
          res.end(JSON.stringify(output));
        });
      });
    } else {
      let queryGenerator = require("../includes/sql");
      let query = queryGenerator.getEventsLoggedOut();
      connection.connect(() => {
        connection.query(query, function(err, results, fields, next) {
          if (err) {
            return next(err);
          }
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
    let queryGenerator = require("../includes/sql");
    let query = queryGenerator.getJoinedEvents(req);
    connection.connect(() => {
      connection.query(query, function(err, results, next) {
        if (err) {
          return next(err);
        }
        function insertUserIntoEvent() {
          let queryGenerator = require("../includes/sql");
          let query = queryGenerator.addUserToEvent(req);
          connection.query(query, function(err, results, next) {
            if (err) {
              return next(err);
            }
            const output = {
              success: true,
              data: results
            };
            res.end(JSON.stringify(output));

            //nodemailer
            let email = require("../nodemailerTemplates/joinedEvent");
            let mailOptions = email.joinedEvent(req);
            transporter.sendMail(mailOptions, (err, info, next) => {
              if (err) { console.log('error sending email notification in joining events') };
            });
          });
        }
        if (results.length === 0) {
          insertUserIntoEvent();
        } else {
          if (results.length == req.body.max) {
            res.end("max");
          } else {
            let queryGenerator = require("../includes/sql");
            let query = queryGenerator.checkIfUserInEvent(req);
            connection.query(query, function(err, results, next) {
              if (err) {
                return next(err);
              }
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
}