var InvId = require('../models/InvId.js');
var User = require('../models/User.js');
var Request = require('../models/Request.js');
var async = require('async');

async.series([
	function (callback) {
		Request.remove({}, callback);
	},
	function (callback) {
		User.find({}, function (err, results) {
			console.log('user.length = ', results.length);
			async.each(results, function (doc) {
				doc.requests = [];
				doc.save();
			});
		});
	}
], function (err) {
	if (err) callback(err);
	console.log('МИГРАЦИЯ ПРОШЛА УСПЕШНО');
})


