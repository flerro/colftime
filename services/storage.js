
var connection = process.env.APP_USER + ":" + process.env.APP_PASSWORD 
					+ "@"  +  process.env.DB_SERVER + ".mongolab.com:29803/database";

var mongojs = require('mongojs')
var db = mongojs(connection, ['colftime'])

// db.on('error', function (err) {
//     console.log('database error', err)
// }); 
 
// db.on('ready', function () {
//     console.log('database connected')
// });

var logError = function(err) { console.log(err) };

exports.clockIn = function() {
	db.colftime.save({clock: 'IN', at: new Date()}, logError)
}

exports.clockOut = function() {
	db.colftime.save({clock: 'OUT', at: new Date()}, logError)
}

exports.list = function(refDate, cb) {
	var dateRangeStart = new Date(refDate.getFullYear(), refDate.getMonth(), 1);
	var dateRangeEnd = new Date(refDate.getFullYear(), refDate.getMonth() + 1, 1);

	db.colftime.aggregate([
		{ $match: { at: { '$gte': dateRangeStart, '$lte': dateRangeEnd} } },
		{ $group: { _id: { $dayOfYear: "$at"}, start: { $first: '$at' }, end: { $last: '$at'} } },
		{ $project: {
           start: "$start",					//	{ $dateToString: { format: "%H:%M", date: "$start" } },
           end: "$end",						// { $dateToString: { format: "%H:%M", date: "$end" } } } 
       	   hours: { $divide: [ { $subtract: [ "$end", "$start" ] }, 3600 * 1000 ] } } },
      	{ $project: { 
      		start: "$start",					//	{ $dateToString: { format: "%H:%M", date: "$start" } },
           	end: "$end",						// { $dateToString: { format: "%H:%M", date: "$end" } } } 
      		hours: { $add: [ { $subtract: [ "$hours", { $mod: ["$hours", 0.5] } ] }, 0.5] } } },  
      	{ $sort: { "start": 1 } }
	]).toArray(cb);
}