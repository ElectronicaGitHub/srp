var config = require('../configs/config_file');
var Request = require('../models/Request.js');
var InvId = require('../models/InvId.js');
var User = require('../models/User.js');

module.exports = function (express) {
	var router = express.Router();

	router.use(function(req, res, next) {

		var auth;
		if (req.headers.authorization) {
			auth = new Buffer(req.headers.authorization.substring(6), 'base64')
			.toString()
			.split(':');
		}
		if (!auth ||
			auth[0] !== config.get('autentification:requests:username') ||
			auth[1] !== config.get('autentification:requests:password')
		) {
			res.statusCode = 401;
			res.setHeader('WWW-Authenticate', 'Basic realm="Server God asks for your password sick hacker!!! Tell him!"');
			res.render('error', {
				message : 'bad rights',
				error : 'bad rights'
			});
		} else {
			next();
		}
	});

	router.get('/', function (req, res, next) {
		Request.find({}).deepPopulate('hotel owner hotel.images').exec(function (err, results) {
			if (err) return next(err);
			res.render('requests', {
				requests : results
			});
		});
	});

	router.post('/r/:id', function (req, res, next) {

		var data = req.body;
		var id = req.params.id;

		Request.findByIdAndUpdate(id, data, function (err, updated_r) {
			res.json({
				message : 'ok'
			});
		});
	});

	router.post('/rpay/:id', function (req, res, next) {

		var data = req.body;
		var id = req.params.id;
		var sum = data.final_price;

		data.status = 2;

		Request.findByIdAndUpdate(id, data, function (err, updated_r) {
			res.json({
				message : 'ok'
			});
		});
		
	});

	return router;
};