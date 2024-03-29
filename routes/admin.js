var multiparty = require('multiparty');
var path = require('path');
var fs = require('fs');
var gm = require('gm').subClass({imageMagick: true});
var async = require('async');
var config = require('../configs/config_file');
var RestPlace = require('../models/RestPlace.js');
var Place = require('../models/Place.js');
var Post = require('../models/Post.js');
var Img = require('../models/Img.js');
var City = require('../models/City.js');
var Tag = require('../models/Tag.js');
var Benefit = require('../models/Benefit.js');

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
	         auth[0] !== config.get('autentification:create:username') || 
	         auth[1] !== config.get('autentification:create:password')
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
		async.series([
		function (cb) {
			Tag.find({}, {}, { sort : { name : 1 }}).populate('image').exec(function (err, tags) {
				cb(null, tags);
			});
		},
		function (cb) {
			Benefit.find({}).populate('image').exec(function (err, benefits) {
				cb(null, benefits);
			});
		},
		function (cb) {
			City.find({}, {}, { sort : { name : 1 }}).populate('image').exec(function (err, cities) {
				cb(null, cities);
			});
		},
		function (cb) {
			RestPlace.find({}, {}, { sort : { title : 1 }}).populate('images').exec(function (err, restplaces) {
				cb(null, restplaces);
			});
		},
		function (cb) {
			Place.find({}).populate('images').exec(function (err, places) {
				cb(null, places);
			});
		},
		function (cb) {
			Post.find({}).exec(function (err, posts) {
				cb(null, posts);
			});
		}], function (err, result) {
			res.render('admin', {
				tags : result[0],
				benefits : result[1],
				cities : result[2],
				restplaces : result[3],
				places : result[4],
				posts : result[5]
			});
		});
	});

	router.get('/create/post', function (req, res, next) {
		res.render('admin_post', {
			post: null
		});
	});

	router.get('/update/post/:id', function (req, res, next) {
		var id = req.params.id;
		Post.findById(id, function (err, post) {
			if (err) return next(err);
			res.render('admin_post', {
				post : post
			});
		});
	});

	router.get('/create/hotel', function (req, res, next) {
		async.series([
		function (cb) {
			Tag.find({ deleted : false }, function (err, tags) {
				cb(null, tags);
			});
		}, function (cb) {
			Benefit.find({}).populate('image').exec(function (err, benefits) {
				cb(null, benefits);
			});
		},
		function (cb) {
			Place.find().populate('images mini_images').exec(function (err, places) {
				cb(null, places);
			});
		},
		function (cb) {
			City.find({ deleted : false }, function (err, places) {
				cb(null, places);
			});
		}],
		function (err, results) {
			res.render('admin_hotels', {
				hotel : null,
				tags : results[0],
				benefits : results[1],
				places : results[2],
				cities : results[3]
			});
		});
	});

	router.get('/update/hotel/:id', function (req, res, next) {
		var id = req.params.id;
		async.series([
		function (cb) {
			RestPlace.findById(id).deepPopulate('images mini_images').exec(function (err, place) {
				cb(null, place);
			});
		},
		function (cb) {
			Place.find().populate('images mini_images').exec(function (err, places) {
				cb(null, places);
			});
		},
		function (cb) {
			City.find({ deleted : false }, function (err, cities) {
				cb(null, cities);
			});
		},
		function (cb) {
			Tag.find({ deleted : false }, function (err, tags) {
				cb(null, tags);
			});
		}, function (cb) {
			Benefit.find({}).populate('image').exec(function (err, benefits) {
				cb(null, benefits);
			});
		}], function (err, result) {
			res.render('admin_hotels', {
				hotel : result[0],
				places : result[1],
				cities : result[2],
				tags : result[3],
				benefits : result[4]
			});
		});
	});

	router.get('/create/place', function (req, res, next) {
		City.find({ deleted : false }, function (err, cities) {
			res.render('admin_places', {
				place : null,
				cities : cities
			});
		});
	});

	router.get('/update/place/:id', function (req, res, next) {
		var id = req.params.id;
		async.series([
		function (cb) {
			Place.findById(id).populate('images mini_images').exec(function (err, place) {
				cb(null, place);
			});
		}, function (cb) {
			City.find({ deleted : false }, function (err, cities) {
				cb(null, cities);
			});
		}], function (err, result) {
			res.render('admin_places', {
				place : result[0],
				cities : result[1]
			});
		});
	});

	router.post('/tag', function (req, res, next) {
		var body = req.body;

		var t = new Tag(body);
		t.save(function (err, readyTag) {
			if (err) return next(err);
			res.json({ message : 'ok' });
		});
	});

	router.post('/city', function (req, res, next) {
		var body = req.body;

		var city = new City(body);
		city.save(function (err, readyCity) {
			if (err) return next(err);
			res.json({ message : 'ok' });
		});
	});

	router.post('/benefit', function (req, res, next) {
		var body = req.body;

		var ben = new Benefit(body);
		ben.save(function (err, readyBenefit) {
			if (err) return next(err);
			res.json({ message : 'ok' });
		});
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

	router.post('/restplace/:id', function (req, res, next) {
		var body = req.body;
		var id = req.params.id;
		delete body._id;

		RestPlace.findByIdAndUpdate(id, body, function (err, restplace) {
			if (err) return next(err);
			res.json({
				message : 'ok'
			});
		});
	});

	router.delete('/place/:id', function (req, res, next) {
		Place.findById(req.params.id).populate('images').exec(function (err, rp) {
			async.each(rp.images, function (file, callback) {
				imageRemove(null, file, function () {
					callback();
				}, function (err) {
					callback(err);
				})
			}, function (err) {
				if (err) return next(err);
				rp.remove(function (err, ok) {
					if (err) return next(err);
					res.json({
						message: 'ok'
					});
					
				})
			});
		});
	});

	router.delete('/restplace/:id', function (req, res, next) {
		RestPlace.findById(req.params.id).populate('images').exec(function (err, rp) {
			async.each(rp.images, function (file, callback) {
				imageRemove(null, file, function () {
					callback();
				}, function (err) {
					callback(err);
				})
			}, function (err) {
				if (err) return next(err);
				rp.remove(function (err, ok) {
					if (err) return next(err);
					res.json({
						message: 'ok'
					});
					
				})
			});
		});
	});

	router.delete('/post/:id', function (req, res, next) {
		Post.findByIdAndRemove(req.params.id, function (err, success) {
			res.json({
				message: 'ok'
			});
		});
	});

	router.post('/tag/:id', function (req, res, next) {
		var data = req.body;
		delete req.body._id;
		Tag.findByIdAndUpdate(req.params.id, data, function (err, success) {
			res.json({
				message: 'ok'
			});
		});
	});

	router.post('/city/:id', function (req, res, next) {
		var data = req.body;
		delete req.body._id;
		City.findByIdAndUpdate(req.params.id, data, function (err, success) {
			res.json({
				message: 'ok'
			});
		});
	});

	router.delete('/city/:id', function (req, res, next) {
		City.findByIdAndUpdate(req.params.id, {
			deleted : true
		}, function (err, success) {
			res.json({
				message: 'ok'
			});
		});
	});

	router.delete('/tag/:id', function (req, res, next) {
		Tag.findByIdAndUpdate(req.params.id, {
			deleted : true
		}, function (err, success) {
			res.json({
				message: 'ok'
			});
		});
	});

	router.post('/restore/city/:id', function (req, res, next) {
		City.findByIdAndUpdate(req.params.id, {
			deleted : false
		}, function (err, success) {
			res.json({
				message: 'ok'
			});
		});
	});

	router.post('/restore/tag/:id', function (req, res, next) {
		Tag.findByIdAndUpdate(req.params.id, {
			deleted : false
		}, function (err, success) {
			res.json({
				message: 'ok'
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

	router.post('/place/:id', function (req, res, next) {
		var body = req.body;
		var id = req.params.id;
		delete body._id;

		Place.findByIdAndUpdate(id, body, function (err, place) {
			if (err) return next(err);
			res.json({
				message : 'ok'
			});
		});
	});

	router.post('/post', function (req, res, next) {
		var body = req.body;
		
		var p = new Post(body);

		p.save(function (err, model) {
			if (err) return next(err);
			res.json({
				message : 'ok'
			});
		});
	});

	router.post('/post/:id', function (req, res, next) {
		var body = req.body;
		var id = req.params.id;
		delete body._id;

		console.log(body);

		Post.findByIdAndUpdate(id, body, function (err, post) {
			console.log(err, post);
			if (err) return next(err);
			res.json({
				message : 'ok'
			});
		});
	});

	router.delete('/image/:id', function (req, res, next) {
		imageRemove(req.params.id, null, function () {
			res.json({
				message : 'ok'
			})
		}, function (err) {
			next(err);
		});
	});

	return router;
};

var imageRemove = function (id, image, cbSuccess, cbError) {
	console.log('image remove');
	async.waterfall([
		function (callback) {
			if (id) {
				Img.findById(id, function (err, img1) {
					callback(null, img1);
				});
			} else {
				callback(null, image);
			}
		},
		function (img, callback) {
			fs.unlink(path.join(__dirname, '../public' + img.path), function (err, msg) {
				fs.unlink(path.join(__dirname, '../public' + img.path_low), function (err, msg) {
					img.remove(function (err, ok) {
						if (err) cbError(err);
						else {
							callback(null);
						}
					});
				});
			});
		}
	], function (err, results) {
		if (err) return cbError(err);
		else {
			cbSuccess();
		}
	});
}

var fileSave = function (file, cb, cbFail) {
	file = file[0];
	if (file.size > (240 * 1024)) {
  		cbFail({
  			message : 'Файл превышает указанный размер в 300 Кб.'
  		});
  	} else {
		var extension_regex = /\.[0-9a-z]+$/i;
        var ext = file.originalFilename.match(extension_regex);

      	var filename = makeID() + 'uid' + ext[0];
      	console.log(filename);

      	async.series([
      		function (callback) {
		      	// сохранить файл в фс
			  	var p = path.join(__dirname, "../public/attachments/" + filename);
      			fs.readFile(file.path, function (err, data) {
      				if (err) callback(err);
					fs.writeFile(p, data, function (err) {
						var path_high = '/attachments/' + filename;
						if (err) callback(err);
						callback(null, path_high);
					});
				});
      		},
      		function (callback) {
			  	var p = path.join(__dirname, "../public/attachments/low_" + filename);
      			gm(file.path).quality(40).write(p, function (err) {
				  	var path_low = '/attachments/low_' + filename;
      				if (err) { 
						callback(err) 
      				}
  					else {
	      				callback(null, path_low);
  					}
      			});
			}
		], function (err, results) {
			if (err) cbFail({ message : err });
			// добавить модель файла
			var img = new Img({
				name : file.originalFilename,
				path : results[0],
				path_low : results[1]
			});
			img.save(function (err, att) {
				if (err) cbFail({ message : err });
				cb(att);
			});
		});
	}
};

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