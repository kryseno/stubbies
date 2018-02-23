exports.joinedEvent = function(request){
    const userEmail = request.session.passport.user._json.email;
    const userName = request.session.passport.user._json.first_name;
    const mailOptions = {
        from: '"Stubbies: Find Your Study Buddies!" <studies.with.stubbies@gmail.com>',
        to: `${userEmail}`,
        subject: 'Study Group Joined!',
        html: `
        <div style='background-color: white; text-align: center; font-family: tahoma'>
        <p><img src="http://i66.tinypic.com/nzkq47.png"></p>
        <span><i>You don't have to study lonely, with Stubbies!</i></span>
        <hr>
        <div style='text-align: left'>
            <h2>Hi, ${userName}! You have joined a study group!</h2>
            <p><b>${request.body.title}</b> will take place on <b>${request.body.date}</b> at <b>${request.body.time}</b>.</p>
            <p>If you wish to contact the group creator prior to your study session, shoot them a message at <b>${request.body.email}</b>.</p>
        </div>
        </div>
    `
    };
    return mailOptions
}