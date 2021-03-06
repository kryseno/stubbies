const mysql = require('mysql');
const credentials = require('../config/mysqlCredentials');

/*************************************************************************/
/*                           -- passport.js --                       */
/*************************************************************************/
/*****************************************************/
/*               Grab User's Facebook ID             */
/*****************************************************/
exports.getFacebookID = function(profile){
    let sql = "SELECT * FROM ?? WHERE ?? = ?";
    let inserts = ['users', 'facebookID', profile.id];
    sql = mysql.format(sql, inserts);
    return sql
}

/*****************************************************/
/*          Change Login Status to Logged In         */
/*****************************************************/
exports.userIsLoggedIn = function(profile){
    let { id, emails: [{value: emailVal}], name: { givenName , familyName}, photos: [{value: photoVal}] } = profile;
    let isLoggedIn = 1;
    let sql = "INSERT INTO ??(??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?)";
    let inserts = ['users', 'facebookID', 'email', 'first_name', 'last_name', 'pictureURL', 'isLoggedIn',
        id, emailVal, givenName, familyName, photoVal, isLoggedIn];
    sql = mysql.format(sql, inserts);
    return sql
}

/*************************************************************************/
/*                            -- Join Page --                            */
/*************************************************************************/
/*****************************************************/
/*            List of Events For Logged In           */
/*****************************************************/
exports.getEventsLoggedIn = function(request){
    let sql = "SELECT ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ?? AS ?? FROM ?? JOIN ?? on ?? = ?? AND ?? = ? WHERE ?? != ?";
    let inserts = ['events.event_id', 'events.title', 'events.description', 'events.subject', 'events.date', 'events.time', 'events.duration', 'events.location', 'events.max', 'events.phone', 'events.email', 'events.facebookID', 'events.coordinates', 'events.isActive', 'events_subjects.subject', 'e_s_subj', 'events', 'events_subjects', 'events.subject', 'events_subjects.id', 'events.isActive', 1, 'events.facebookID', request.session.passport.user.id];
    sql = mysql.format(sql, inserts);
    return sql
}

/*****************************************************/
/*         List of Events For Not Logged In          */
/*****************************************************/
exports.getEventsLoggedOut = function(){
    let sql = "SELECT ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ?? AS ?? FROM ?? JOIN ?? on ?? = ?? AND ?? = ?";
    let inserts = ['events.event_id', 'events.title', 'events.description', 'events.subject', 'events.date', 'events.time', 'events.duration', 'events.location', 'events.max', 'events.phone', 'events.email', 'events.facebookID', 'events.coordinates', 'events.isActive', 'events_subjects.subject', 'e_s_subj', 'events', 'events_subjects', 'events.subject', 'events_subjects.id', 'events.isActive', 1];
    sql = mysql.format(sql, inserts);
    return sql
}

/*****************************************************/
/*                  Add User to Event                */
/*****************************************************/
exports.addUserToEvent = function(request){
    let sql = "INSERT INTO ?? SET ?? = ?, ?? = ?";
    let inserts = ['joined_events', 'facebookID', request.session.passport.user.id, 'event_id', request.body.event_id];
    sql = mysql.format(sql, inserts);
    return sql
}

/*****************************************************/
/*         Check If User Already Joined Event        */
/*****************************************************/
exports.checkIfUserInEvent = function(request){
    let sql = "SELECT ??, ??, ?? FROM ?? WHERE ?? = ? AND ?? = ?";
    let inserts = ['id', 'facebookID', 'event_id', 'joined_events', 'event_id', request.body.event_id, 'facebookId', request.session.passport.user.id];
    sql = mysql.format(sql, inserts);
    return sql
}

/*************************************************************************/
/*                           -- Create Page --                           */
/*************************************************************************/
/*****************************************************/
/*                    Add an Event                   */
/*****************************************************/
exports.addEvent = function(request){
    let sql = "INSERT INTO ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?";
    let inserts = ['events', 'title', request.body.title, 'description', request.body.description, 'subject', request.body.subject, 'date', request.body.date, 'time', request.body.time, 'duration', request.body.duration, 'location', request.body.location, 'max', request.body.max, 'phone', request.body.phone, 'email', request.body.email, 'coordinates', request.body.coordinates, 'facebookID', request.session.passport.user.id, 'isActive', 1];
    sql = mysql.format(sql, inserts);
    return sql
}

/*****************************************************/
/*             Add Event Creator to Event            */
/*****************************************************/
exports.addCreatorToEvent = function(request, results){
    let sql = "INSERT INTO ?? SET ?? = ?, ?? = ?";
    let inserts = ['joined_events', 'facebookID', request.session.passport.user.id, 'event_id', results.insertId];
    sql = mysql.format(sql, inserts);
    return sql
}

/*****************************************************/
/*                Get Subject from Table             */
/*****************************************************/
exports.getSubject = function(request){
    let sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    let inserts = ['subject', 'events_subjects', 'id', request.body.subject];
    sql = mysql.format(sql, inserts);
    return sql
}

/*************************************************************************/
/*                           -- Profile Page --                          */
/*************************************************************************/
/*****************************************************/
/*                Events User Joined                 */
/*****************************************************/
exports.getUserEventsJoined = function(request){
    let sql = "SELECT ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ?? AS ?? FROM ?? INNER JOIN ?? on ?? = ?? INNER JOIN ?? on ?? = ?? WHERE ?? = ? AND ?? != ? AND ?? = ?";
    let inserts = ['joined_events.id', 'joined_events.facebookID', 'joined_events.event_id', 'events.event_id', 'events.title', 'events.description', 'events.subject', 'events.date', 'events.time', 'events.duration', 'events.location', 'events.max', 'events.phone', 'events.email', 'events.facebookID', 'events.coordinates', 'events.isActive', 'events_subjects.id', 'events_subjects.subject', 'e_s_subj', 'events', 'joined_events', 'joined_events.event_id', 'events.event_id', 'events_subjects', 'events_subjects.id', 'events.subject', 'joined_events.facebookID', request.session.passport.user.id, 'events.facebookID', request.session.passport.user.id, 'isActive', 1]
    sql = mysql.format(sql, inserts);
    return sql
}

/*****************************************************/
/*                Events User Created                */
/*****************************************************/
exports.getUserEventsCreated = function(request){
    let sql = "SELECT ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ?? AS ?? FROM ?? JOIN ?? on ?? = ?? WHERE ?? = ? AND ?? = ?";
    let inserts = ['events.event_id', 'events.title', 'events.description', 'events.subject', 'events.date', 'events.time', 'events.duration', 'events.location', 'events.max', 'events.phone', 'events.email', 'events.facebookID', 'events.coordinates', 'events.isActive', 'events_subjects.subject', 'e_s_subj', 'events', 'events_subjects', 'events.subject', 'events_subjects.id', 'isActive', 1, 'facebookID', request.session.passport.user.id];
    sql = mysql.format(sql, inserts);
    return sql
}

/*****************************************************/
/*               Remove User From Event              */
/*****************************************************/
exports.removeUserFromEvent = function(request){
    let sql = "DELETE FROM ?? WHERE ?? = ? AND ?? = ?";
    let inserts = ['joined_events', 'facebookID', request.session.passport.user.id, 'event_id', request.body.event_id];
    sql = mysql.format(sql, inserts);
    return sql
}

/*****************************************************/
/*                  Soft Delete Event                */
/*****************************************************/
exports.deleteEvent = function(request){
    let sql = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
    let inserts = ['events', 'isActive', 0, 'event_id', request.body.event_id];
    sql = mysql.format(sql, inserts);
    return sql
}

/*************************************************************************/
/*                           -- Universal Query --                       */
/*************************************************************************/
/*****************************************************/
/*                 Grab Joined Events                */
/*****************************************************/
exports.getJoinedEvents = function(request){
    let sql = "SELECT ??, ??, ?? FROM ?? WHERE ?? = ?";
    let inserts = ['id', 'facebookID', 'event_id', 'joined_events', 'event_id', request.body.event_id];
    sql = mysql.format(sql, inserts);
    return sql
}

/*************************************************************************/
/*                           -- auth.js --                       */
/*************************************************************************/
/*****************************************************/
/*               Set User As Logged In             */
/*****************************************************/
exports.setUserLoggedIn = function(req){
    let sql = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
    let inserts = ['users', 'isLoggedIn', 1, 'facebookID', req.session.passport.user.id];
    sql = mysql.format(sql, inserts);
    return sql
}

/*****************************************************/
/*               Set User As Logged Out              */
/*****************************************************/
exports.setUserLoggedOut = function(req){
    let sql = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
    let inserts = ['users', 'isLoggedIn', 0, 'facebookID', req.session.passport.user.id];
    sql = mysql.format(sql, inserts);
    return sql
}