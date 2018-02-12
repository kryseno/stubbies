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
        <p><b>${req.body.title}</b> will take place on <b>${req.body.date}</b> at <b>${req.body.time}</b>.</p>
        <p>If you wish to contact the group creator prior to your study session, shoot them a message at <b>${req.body.email}</b>.</p>
    </div>
    </div>
`
};