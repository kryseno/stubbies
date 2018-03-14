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
  //             Adding Events            //
  //**************************************//
  app.post("/add_events", function(req, res) {
    const connection = mysql.createConnection(credentials);
    let queryGenerator = require("../includes/sql");
    let query = queryGenerator.addEvent(req);
    connection.connect(() => {
      connection.query(query, function(err, results, fields, next) {
        if (err) {
          return next(err);
        }
        let queryGenerator = require("../includes/sql");
        let query = queryGenerator.addCreatorToEvent(req, results);
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
          let queryGenerator = require("../includes/sql");
          let query = queryGenerator.getSubject(req);
          connection.query(query, function(err, subject, next) {
            if (err) {
              return next(err);
            }
            let email = require("../nodemailerTemplates/createdEvent");
            let mailOptions = email.createdEvent(req, subject);
            transporter.sendMail(mailOptions, (err, info, next) => {
              if (err) { console.log('error sending email notification in creating events') };
            });
          });
        });
      });
    });
  });
};
