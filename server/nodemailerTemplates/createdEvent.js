exports.createdEvent = function(request, field){
    const subject = field[0].subject;
    const mailOptions = {
        from: '"Stubbies: Find Your Study Buddies!" <studies.with.stubbies@gmail.com>',
        to: `${request.body.email}`,
        subject: 'Study Group Created!',
        html: `
            <div style='background-color: white; text-align: center; font-family: tahoma'>
            <p><img src="http://i66.tinypic.com/nzkq47.png"></p>
            <span><i>You don't have to study lonely, with Stubbies!</i></span>
            <hr>
                <div style='text-align: left'>
                <h2>Here are the details of your study group!</h2>
                <p><b>${request.body.title}</b> will take place on <b>${request.body.date}</b> at <b>${request.body.time}</b>.</p>
                <p><b>Where:</b> ${request.body.location}</p>
                <p><b>Description:</b> ${request.body.description}</p>
                <p><b>Duration:</b> ${request.body.duration}</p>
                <p><b>Subject:</b> ${subject}</b></p>
                <p><b>Group Size:</b> ${request.body.max}</p>
                <p><b>Phone Provided:</b> ${request.body.phone}</p>
                <p><b>Email Provided:</b> ${request.body.email}</p>
                </div>
            </div>
            `
    };
    return mailOptions
}