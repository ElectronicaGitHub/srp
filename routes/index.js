module.exports = function (express) {
	var router = express.Router();

	router.get('/', function (req, res, next) {
		res.render('main');
	});

	return router;
}