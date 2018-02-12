// const express = require('express');
// const mysql = require('mysql');
// const credentials = require('../mysql_credentials');

// const add_events = require('./add_events');

// const router = express.Router();

// router.get('/', function(req, res) {
//     res.send("luigi");
// })

// router.get('/dbtest',function(req, res){
//     console.log('these are the cred:',credentials);
//     const connection = mysql.createConnection(credentials);
//     connection.connect( function(){
//         console.log('these are the arguments:',arguments);
//         connection.query('SELECT * FROM events', function(err, results){
//             res.end(JSON.stringify(results));
//         })
//     })
// })

// router.get('/test2', function(req, res) {
//     res.send("mario");
// })

// router.get('/add_events', add_events);

// module.exports = router;