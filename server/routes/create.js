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
  //             Adding Events            //
  //**************************************//
  app.post("/add_events", function(req, res) {
    const connection = mysql.createConnection(credentials);
    let sql = require("../config/sql");
    sql = sql.addEvent(req);
    connection.connect(() => {
      connection.query(sql, function(err, results, fields, next) {
        if (err) {
          return next(err);
        }
        let sql = require("../config/sql");
        sql = sql.addCreatorToEvent(req, results);
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
          let sql = require("../config/sql");
          sql = sql.getSubject(req);
          connection.query(sql, function(err, subject, next) {
            if (err) {
              return next(err);
            }
            let email = require("../nodemailerTemplates/createdEvent");
            let mailOptions = email.createdEvent(req, subject);
            transporter.sendMail(mailOptions, (err, info, next) => {
              if (err) {
                return next(err);
              }
            });
          });
        });
      });
    });
  });
};