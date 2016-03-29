var RestPlace = require('../models/RestPlace.js');
var Img = require('../models/Img.js');
var Benefit = require('../models/Benefit.js');
var Place = require('../models/Place.js');
var Post = require('../models/Post.js');
var Tag = require('../models/Tag.js');
var City = require('../models/City.js');
var User = require('../models/User.js');
var Request = require('../models/Request.js');
var async = require('async');
var sm = require('sitemap');
var config = require('./../configs/config_file');

var newRequestTmpl = require('../mailTemplate/newRequest.js');

// почтовая залупа
var nodemailer = require('nodemailer');
var mandrillTransport = require('nodemailer-mandrill-transport');
var transport = nodemailer.createTransport(mandrillTransport({
	auth: {
		apiKey: '4Xj9PqPRZMf48cOOLBohIg'
	}
}));

module.exports = function (express) {
	var router = express.Router();


	router.get('/', function (req, res, next) {
		async.series([
			function (cb) {
				Tag.find({ deleted : false }).populate('image').exec(function (err, tags) {
					cb(null, tags);
				});
			},
			function (cb) {
				City.find({ deleted : false }).populate('image').exec(function (err, places) {
					cb(null, places);
				});
			},
			function (cb) {
				City.find({ deleted : false, popular : true }).populate('image').exec(function (err, places) {
					cb(null, places);
				});
			},
			function (cb) {
				RestPlace.find({}).deepPopulate('city images mini_images tags benefits benefits.image places.city places.images places.mini_images')
				.limit(10)
				.exec(function (err, hotels) {
					cb(null, hotels);
				});
			}],
			function (err, results) {
				res.render('index', {
					tags : results[0],
					cities : results[1],
					cities_popular : results[2],
					hotels : results[3],
					costs : [
						{ _id : 0, name : 'до 3000'},
						{ _id : 1, name : 'от 3000 до 6000'},
						{ _id : 2, name : 'от 6000'}
					],
					host : req.protocol + '://'+ req.headers.host
				});
			});
	});

	router.get('/cabinet', function (req, res, next) {
		if (!req.user) {
			res.redirect('/');
		} else {
			Request.find({ owner : req.user._id})
				.deepPopulate('hotel owner hotel.mini_images')
				.exec(function (err, requests) {
				if (err) return next(err);
				res.render('cabinet', {
					requests : requests,
					yandexMoney : config.get('yandex.money')
				});
			});
		}
	});

	router.get('/tag/:name_url', function (req, res, next) {
		var id;
		// Ищем отели с этим тегом
		// Берем все иды городов по этому тегу
		// Ищем по этим идам города
		async.series([
			function (cb) {
				Tag.findOne({ name_url : req.params.name_url}).populate('image').exec(function (err, result) {
					id = result._id;
					cb(null, result);
				});
			},
			function (cb) {
				RestPlace.find({ tags : id }).populate('city').exec(function (err, places) {
					var obj = {};
					places.map(function (el) {
						obj[el.city._id] = true;
						return el.city._id;
					});
					City.find({
						_id : {
							'$in' : Object.keys(obj)
						}
					}).populate('image').exec(function (err, result) {
						if (err) return next(err);
						id = result._id;
						cb(null, result);
					});
				})
			}
		], function (err, results) {
			if (err) return next(err);

			res.render('tag', {
				tag : results[0],
				cities : results[1],
				host : req.protocol + '://'+ req.headers.host
			});
		});
	})

	router.get('/hotels', function (req, res, next) {
		console.log(req.query);
		async.series([
			function (cb) {
				Tag.find({ deleted : false }).populate('image').exec(function (err, tags) {
					cb(null, tags);
				});
			},
			function (cb) {
				City.find({ deleted : false }).populate('image').exec(function (err, places) {
					cb(null, places);
				});
			},
			function (cb) {
				City.find({ deleted : false, popular : true }).populate('image').exec(function (err, places) {
					cb(null, places);
				});
			},
			function (cb) {
				RestPlace
				.find(req.query)
				.deepPopulate('city images mini_images tags benefits benefits.image places.city places.images places.mini_images')
				.limit(10)
				.exec(function (err, hotels) {
					cb(null, hotels);
				});
			}],
			function (err, results) {
				res.render('hotels_list', {
					tags : results[0],
					cities : results[1],
					cities_popular : results[2],
					hotels : results[3],
					costs : [
						{ _id : 0, name : 'до 3000'},
						{ _id : 1, name : 'от 3000 до 6000'},
						{ _id : 2, name : 'от 6000'}
					],
					host : req.protocol + '://'+ req.headers.host
				});
			});
	});

	router.get('/about', function (req, res, next) {
		res.render('about');
	});
	router.get('/contacts', function (req, res, next) {
		res.render('contacts');
	});
	router.get('/sogl', function (req, res, next) {
		res.render('polz_sogl');
	});
	router.get('/oferta', function (req, res, next) {
		res.render('oferta');
	});

	router.get('/blog', function (req, res, next) {
		Post.find({}, function (err, results) {
			if (err) return next(err);
			res.render('blog', {
				posts : results
			});
		});
	});

	router.get('/blog/:title_url', function (req, res, next) {
		Post.findOne({ title_url : req.params.title_url }, function (err, result) {
			if (err) return next(err);
			res.render('blog_post', {
				post : result
			});
		});
	});

	router.get('/city/:name_url', function (req, res, next) {
		var sobj = {}, fromTag;
		var d = req.headers.referer && req.headers.referer.split('/');
		if (d && d[d.length -2 ] == 'tag') {
			fromTag = true;
		}
		async.series([
			function (cb) {
				if (fromTag) {
					Tag.findOne({ name_url : d[d.length - 1]}, function (err, result) {
						sobj.tags  = result._id;
						cb(null);
					});
				} else cb(null);
			},
			function (cb) {
				City.findOne({ name_url : req.params.name_url }).populate('image').exec(function (err, result) {
					if (err) return next(err);
					sobj.city = result._id;
					cb(null, result);
				});
			},
			function (cb) {
				RestPlace
					.find(sobj)
					.deepPopulate('city images mini_images tags benefits benefits.image places.city places.images places.mini_images')
					.exec(function (err, results) {
						if (err) return next(err);
						cb(null, results);
				});
			},
			function (cb) {
				Place.find({ city : sobj.city }).populate('city mini_images images').exec(function (err, results) {
					if (err) return next(err);
					cb(null, results);
				});
			}
		], function (err, results) {
			if (err) return next(err);

			res.render('city', {
				city : results[1],
				hotels : results[2],
				places : results[3],
				host : req.protocol + '://'+ req.headers.host
			});
		});
	});

	router.post('/api/getHotels', function (req, res, next) {
		var p = req.query.p;

		RestPlace.find(req.body)
		.deepPopulate('images mini_images city tags benefits benefits.image places places.city places.images places.mini_images')
		.skip(p * 10)
		.limit(10)
		.exec(function (err, hotels) {
			if(err) return next(err);
			res.json({
				hotels: hotels
			});
		});
	});

	router.get('/hotel/:title_url', function (req, res, next) {

		RestPlace.findOne({
			title_url : req.params.title_url
		}).deepPopulate('images mini_images city tags benefits benefits.image places places.city places.images places.mini_images')
		// .select('-_id')
		.exec(function (err, hotel) {
			if(err) return next(err);
			if (!hotel) res.send(404);

			if (req.user) {
				User.findById(req.user._id).populate('requests').exec(function (err, user) {
					if(err) return next(err);

					req.user = res.locals.user = user;

					res.render('hotel_card', {
						hotel : hotel,
						host : req.protocol + '://'+ req.headers.host
					});
				});
			} else {
				res.render('hotel_card', {
					hotel : hotel,
					host : req.protocol + '://'+ req.headers.host
				});
			}

		});
	});

	router.get('/place/:title_url', function (req, res, next) {
		Place.findOne({
			title_url : req.params.title_url
		// }).populate('images mini_images city')
		}).populate('images mini_images city')
		.exec(function (err, place) {
			console.log('place', place);
			if(err) return next(err);
			if (!place) res.send(404);
			res.render('place_card', {
				hotel : place
			});
		});
	});

	router.post('/create_offer', function (req, res, next) {

		var body = req.body;
		body.owner = req.user._id;

		Request.create(body, function (err, result) {

			console.log(err);
			if (err) return next(err);
			// transport.sendMail({
			// 	from : "antonovphilipdev@gmail.com",
			// 	to: "alexandrtito@gmail.com",
			// 	subject: 'Поступил новый запрос)',
			// 	html: newRequestTmpl(body)
			// }, function (err, info) {
			// 	if (err) callback(err);

			// 	res.json({
			// 		message : 'ok'
			// 	});
				
			// 	transport.sendMail({
			// 		from : "antonovphilipdev@gmail.com",
			// 		to: "molo4nik11@gmail.com",
			// 		subject: 'Поступил новый запрос)',
			// 		html: newRequestTmpl(body)
			// 	}, function (err, info) {
			// 		if (err) callback(err);
			// 	});
			// });

			User.findByIdAndUpdate(req.user._id, {
				'$addToSet' : { requests : result._id }
			}, function (err, upd) {
				if (err) return next(err);

				req.session.update_user = true;

				res.json({
					message : 'ok'
				});

			});

		});

	});

	router.get('/sitemap.xml', function (req, res, next) {
		var urls = [];
		var urls2 = [];
		RestPlace.find({}, function (err, hotels) {
			if (err) return next(err);
			urls = hotels.map(function(el) {
				return {
					url : '/hotel/' + el.title_url,
					changefreq : 'daily'
				};
			});
			Place.find({}, function (err, places) {
				if (err) return next(err);
				urls2 = places.map(function(el) {
					return {
						url : '/place/' + el.title_url,
						changefreq : 'daily'
					};
				});
				sitemap = sm.createSitemap ({
					hostname: req.headers.host,
					cacheTime: 600000,        // 600 sec - cache purge period
					urls: urls.concat(urls2)
				});
				sitemap.toXML( function (err, xml) {
					if (err) {
						return res.status(500).end();
					}
					res.header('Content-Type', 'application/xml');
					res.send( xml );
				});
			});
		});
	});

	router.get('/robots.txt', function(req, res) {
		res.set('Content-Type', 'text/plain');
		res.sendfile('robots.txt');
	});

	return router;
};