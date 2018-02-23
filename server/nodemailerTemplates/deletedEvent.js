exports.deletedEvent = function (request){
    const userEmail = request.session.passport.user._json.email;
    const userName = request.session.passport.user._json.first_name;
    const mailOptions = {
        from: '"Stubbies: Find Your Study Buddies!" <studies.with.stubbies@gmail.com>',
        to: `${userEmail}`,
        subject: 'Study Group Deleted!',
        html: `
            <div style='background-color: white; text-align: center; font-family: tahoma'>
            <p><img src="http://i66.tinypic.com/nzkq47.png"></p>
            <span><i>You don't have to study lonely, with Stubbies!</i></span>
            <hr>
            <div style='text-align: left'>
                <h2>Hi ${userName}! You have successfully deleted your study group event.</h2>
                <p><b>${request.body.title}</b> scheduled for <b>${request.body.date}</b> at <b>${request.body.time}</b> was deleted.</p>
                <p><b>If you wish to undo this, recreate your study group <a href="http://dev.michaelahn.solutions/create-event">here</a>.</b></p>
            </div>
            </div>
            `
    };
    return mailOptions
}