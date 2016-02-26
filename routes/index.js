var RestPlace = require('../models/RestPlace.js');
var Img = require('../models/Img.js');
var Benefit = require('../models/Benefit.js');
var Place = require('../models/Place.js');
var Post = require('../models/Post.js');
var Tag = require('../models/Tag.js');
var City = require('../models/City.js');
var async = require('async');
var sm = require('sitemap');

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
				Tag.find({}, function (err, tags) {
					cb(null, tags);
				});
			},
			function (cb) {
				City.find(function (err, places) {
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
					hotels : results[2],
					costs : [
						{ _id : 0, name : 'до 3000'},
						{ _id : 1, name : 'от 3000 до 6000'},
						{ _id : 2, name : 'от 6000'}
					]
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
		})
	})

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
		.select('-_id')
		.exec(function (err, hotel) {
			if(err) return next(err);
			if (!hotel) res.send(404);
			res.render('hotel_card', {
				hotel : hotel
			});
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

		transport.sendMail({
			from : "molo4nik11@gmail.com",
			to: "antonovphilipdev@gmail.com",
			subject: 'Поступил новый запрос)',
			html: newRequestTmpl(body)
		}, function (err, info) {
			if (err) callback(err);
			res.json({
				message : 'ok'
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