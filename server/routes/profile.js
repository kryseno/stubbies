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
  //      Display Events User Joined      //
  //**************************************//
  app.get("/user_joined_events", function(req, res) {
    const connection = mysql.createConnection(credentials);
    let queryGenerator = require("../includes/sql");
    let query = queryGenerator.getUserEventsJoined(req);
    connection.connect(() => {
      connection.query(query, function(err, results, next) {
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
  });

  //**************************************//
  //             Leaving Events           //
  //**************************************//
  app.post("/leave_event", function(req, res) {
    const connection = mysql.createConnection(credentials);
    let queryGenerator = require("../includes/sql");
    let query = queryGenerator.getJoinedEvents(req);
    connection.connect(() => {
      connection.query(query, function(err, results, next) {
        if (err) {
          return next(err);
        }
        let queryGenerator = require("../includes/sql");
        let query = queryGenerator.removeUserFromEvent(req);
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
          let email = require("../nodemailerTemplates/leftEvent");
          let mailOptions = email.leftEvent(req);
          transporter.sendMail(mailOptions, (err, info, next) => {
            if (err) { console.log('error sending email notification in leaving events') };
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
    let queryGenerator = require("../includes/sql");
    let query = queryGenerator.getUserEventsCreated(req);
    connection.connect(() => {
      connection.query(query, function(err, results, fields, next) {
        if (err) {
          return next(err);
        }
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
    let queryGenerator = require("../includes/sql");
    let query = queryGenerator.deleteEvent(req);
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

        //nodemailer
        let email = require("../nodemailerTemplates/deletedEvent");
        let mailOptions = email.deletedEvent(req);
        transporter.sendMail(mailOptions, (err, info, next) => {
          if (err) { console.log('error sending email notification in deleting events') };
        });
      });
    });
  });
};