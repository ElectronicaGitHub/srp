var RestPlace = require('../models/RestPlace.js');
var Img = require('../models/Img.js');

module.exports = function (express) {
	var router = express.Router();

	router.get('/', function (req, res, next) {
		RestPlace.find().deepPopulate('images mini_images tags benefits benefits.image places places.images places.mini_images')
		.exec(function (err, hotels) {
			if(err) return next(err);
			res.render('index', {
				hotels : hotels
			});
	    });
	});

	router.get('/hotel/:title_url', function (req, res, next) {
		RestPlace.findOne({
			title_url : req.params.title_url
		}).deepPopulate('images mini_images tags benefits benefits.image places places.images places.mini_images')
		.exec(function (err, hotel) {
			if(err) return next(err);
			res.render('hotel_card', {
				hotel : hotel
			});
	    });
	});

	return router;
}