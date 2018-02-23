exports.leftEvent = function(request){
    const userEmail = request.session.passport.user._json.email;
    const userName = request.session.passport.user._json.first_name;
    const mailOptions = {
        from: '"Stubbies: Find Your Study Buddies!" <studies.with.stubbies@gmail.com>',
        to: `${userEmail}`,
        subject: 'You Left A Study Group!',
        html: `
            <div style='background-color: white; text-align: center; font-family: tahoma'>
            <p><img src="http://i66.tinypic.com/nzkq47.png"></p>
            <span><i>You don't have to study lonely, with Stubbies!</i></span>
            <hr>
            <div style='text-align: left'>
                <h2>You have left ${request.body.title}!</h2>
                <p>Your study buddies are sad to see you go :( Hope to see you in another group!</p>
                <p>If this was a mistake, rejoin ${request.body.title} before it fills up! Join again by clicking 'Join' on the event <a href="http://dev.michaelahn.solutions/join-event">here</a>.</p>
                </div>
            </div>
            `
    };
    return mailOptions
}