var RestPlace = require('../models/RestPlace.js');
var Img = require('../models/Img.js');

module.exports = function (express) {
	var router = express.Router();

	router.get('/', function (req, res, next) {
		res.render('index');
	});

	router.get('/hotel/:title_url', function (req, res, next) {
		RestPlace.findOne({
			title_url : req.params.title_url
		}).populate('images mini_images').exec(function (err, hotel) {
			if(err) return next(err);
			res.render('hotel_card', {
				hotel : hotel
			});
		})
	})

	return router;
}