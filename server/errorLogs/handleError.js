exports.logError = function (err, req, res, next){
    if (!err) {
        next()
    } else {
        console.log('There was an error');
        let errorData= {Date: new Date().toLocaleString(),errorMessage: err.stack};
        fs.appendFile(path.join(__dirname, 'errorLogs', 'serverError.log'), JSON.stringify(errorData) + '\n', function (err) {
            if (err) next(err); 
            console.log('Updated!');
         });
        res.status(500).render('error', { error: err });
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