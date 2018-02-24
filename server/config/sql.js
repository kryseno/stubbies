const mysql = require('mysql');
const credentials = require('./mysqlCredentials');

exports.getEventsLoggedIn = function(request){
    let sql = "SELECT ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ?? AS ?? FROM ?? JOIN ?? on ?? = ?? AND ?? = ? WHERE ?? != ?";
    let inserts = ['events.event_id', 'events.title', 'events.description', 'events.subject', 'events.date', 'events.time', 'events.duration', 'events.location', 'events.max', 'events.phone', 'events.email', 'events.facebookID', 'events.coordinates', 'events.isActive', 'events_subjects.subject', 'e_s_subj', 'events', 'events_subjects', 'events.subject', 'events_subjects.id', 'events.isActive', 1, 'events.facebookID', request.session.passport.user.id];
    sql = mysql.format(sql, inserts);
    return sql
}

exports.getEventsLoggedOut = function(){
    let sql = "SELECT ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ??, ?? AS ?? FROM ?? JOIN ?? on ?? = ?? AND ?? = ?";
    let inserts = ['events.event_id', 'events.title', 'events.description', 'events.subject', 'events.date', 'events.time', 'events.duration', 'events.location', 'events.max', 'events.phone', 'events.email', 'events.facebookID', 'events.coordinates', 'events.isActive', 'events_subjects.subject', 'e_s_subj', 'events', 'events_subjects', 'events.subject', 'events_subjects.id', 'events.isActive', 1];
    sql = mysql.format(sql, inserts);
    return sql
}