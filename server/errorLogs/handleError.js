const fs = require('fs');
const path = require('path');

exports.logErrors = function (err, req, res, next){
    if (!err) {
        next()
    } else {
        console.error(err.stack);
        // console.log('There was an error.')
        // let errorData= {Date: new Date().toLocaleString(), errorMessage: err.stack};
        // fs.appendFile('errorLogs/serverError.log', JSON.stringify(errorData) + '\n', function (err) {
        //     if (err) next(err); 
        //     console.log('Updated error.');
        //  });
        // res.status(500).render('error', { error: err });
        next(err);
    }


};

exports.errorHandler = (err, req, res, next)=>{
    if (res.headersSent) {
        return next(err)
      }
      res.status(500)
      res.render('error', { error: err })
    
};
