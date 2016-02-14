var RestPlace = require('../models/RestPlace.js');
var Img = require('../models/Img.js');
var Benefit = require('../models/Benefit.js');
var Place = require('../models/Place.js');
var Tag = require('../models/Tag.js');
var City = require('../models/City.js');
var async = require('async');

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
			res.render('hotel_card', {
				hotel : hotel
			});
		});
	});

	router.get('/place/:title_url', function (req, res, next) {
		Place.findOne({
			title_url : req.params.title_url
		// }).populate('images mini_images city')
		}).populate('images mini_images')
		.exec(function (err, place) {
			console.log('place', place);
			if(err) return next(err);
			res.render('place_card', {
				hotel : place
			});
		});
	});

	return router;
};