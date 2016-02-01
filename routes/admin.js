var multiparty = require('multiparty');
var path = require('path');
var fs = require('fs');
var async = require('async');
var RestPlace = require('../models/RestPlace.js');
var Place = require('../models/Place.js');
var Img = require('../models/Img.js');
var Tag = require('../models/Tag.js');
var Benefit = require('../models/Benefit.js');
var benefitsData = require('../data/data.js');

module.exports = function (express) {
	var router = express.Router();

	router.get('/', function (req, res, next) {
		async.series([
			function (cb) {
				Tag.find({}, function (err, tags) {
					cb(null, tags);
				});
			}, function (cb) {
				Benefit.find({}).populate('image').exec(function (err, benefits) {
					cb(null, benefits);
				})
			}, 
			function (cb) {
				Place.find().populate('images mini_images').exec(function (err, places) {
					cb(null, places);
				})
			}],
			function (err, results) {
				res.render('admin', {
					tags : results[0],
					benefits : results[1],
					places : results[2]
				});
			});
	});

	router.get('/misc', function (req, res, next) {
		async.series([
			function (cb) {
				Tag.find({}, function (err, tags) {
					cb(null, tags);
				});
			}, function (cb) {
				Benefit.find({}).populate('image').exec(function (err, benefits) {
					cb(null, benefits);
				})
			}], 
			function (err, results) {
				res.render('admin_misc', {
					tags : results[0],
					benefits : results[1]
				});
			})
	});

	router.get('/places', function (req, res, next) {
		res.render('admin_places');
	});

	router.post('/tag', function (req, res, next) {
		var body = req.body;

		var t = new Tag(body);
		t.save(function (err, readyTag) {
			if (err) return next(err);
			res.json({ message : 'ok' });
		})
	});

	router.post('/benefit', function (req, res, next) {
		var body = req.body;

		var ben = new Benefit(body);
		ben.save(function (err, readyBenefit) {
			if (err) return next(err);
			res.json({ message : 'ok' });
		})
	});


	router.post('/loadImages', function (req, res, next) {

		var form = new multiparty.Form();
		var filesArray = [];
		form.parse(req, function(err, fields, files) {
			async.each(files, function (file, cb) {
				fileSave(file, function (readyFile) {
					filesArray.push(readyFile);
					cb(null);
				}, function (err) {
					res.json({message : err});
				});
			}, function (err) {
				if (err) return next(err);
				res.json({ message : 'ok' , filesArray : filesArray });
			});
		});
	});

	router.post('/restplace', function (req, res, next) {
		var body = req.body;
		
		var rp = new RestPlace(body);

		rp.save(function (err, model) {
			if (err) return next(err);
			console.log(arguments);
			res.json({
				message : 'ok'
			});
		});
	});

	router.post('/place', function (req, res, next) {
		var body = req.body;
		
		var p = new Place(body);

		p.save(function (err, model) {
			if (err) return next(err);
			console.log(arguments);
			res.json({
				message : 'ok'
			});
		});
	});

	return router;
}

var fileSave = function (file, cb, cbFail) {
	file = file[0];
	if (file.size > (300 * 1024)) {
  		cbFail({
  			message : 'Файл превышает указанный размер в 300 Кб.'
  		});
  	} else {
      	var filename = makeID() + 'uid' + file.originalFilename;
      	async.waterfall([
      		function (callback) {
		      	// сохранить файл в фс
			  	var p = path.join(__dirname, "../public/attachments/" + filename);
      			fs.readFile(file.path, function (err, data) {
      				if (err) callback(err);
					fs.writeFile(p, data, function (err) {
						var realPath = '/attachments/' + filename;
						if (err) callback(err);
						callback(null, realPath);
					});
				});
      		},
      		function (path, callback) {
		      	// добавить модель файла
		      	var img = new Img({
		      		name : file.originalFilename,
		      		path : path
		      	})
		      	img.save(function (err, att) {
		      		if (err) callback(err);
		      		callback(null, att);
		      	})	
      		}
      	], function (err, attachment) {
      		if (err) cbFail({ message : err });
      		cb(attachment);
      	})
  	}
}

var makeID = function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  	}
  	var d = s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4(); 
    return d;
};