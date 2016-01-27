module.exports = function (express) {
	var router = express.Router();

	router.get('/', function (req, res, next) {
		res.render('index');
	});

	return router;
}