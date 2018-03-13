const mysql = require("mysql");
const credentials = require("../config/mysqlCredentials");
const nodemailer = require("nodemailer");
const { USERNAME, PASSWORD } = require("../config/nodemailerConfig.js");

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
      let sql = require("../config/sql");
      sql = sql.getEventsLoggedIn(req);
      connection.connect(() => {
        connection.query(sql, function(err, results, fields, next) {
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
      let sql = require("../config/sql");
      sql = sql.getEventsLoggedOut();
      connection.connect(() => {
        connection.query(sql, function(err, results, fields, next) {
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
    let sql = require("../config/sql");
    sql = sql.getJoinedEvents(req);
    connection.connect(() => {
      connection.query(sql, function(err, results, next) {
        if (err) {
          return next(err);
        }
        function insertUserIntoEvent() {
          let sql = require("../config/sql");
          sql = sql.addUserToEvent(req);
          connection.query(sql, function(err, results, next) {
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
              if (err) {
                return next(err);
              }
            });
          });
        }
        if (results.length === 0) {
          insertUserIntoEvent();
        } else {
          if (results.length == req.body.max) {
            res.end("max");
          } else {
            let sql = require("../config/sql");
            sql = sql.checkIfUserInEvent(req);
            connection.query(sql, function(err, results, next) {
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