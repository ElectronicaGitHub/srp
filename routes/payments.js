var shopId = 51180;
var scid = 533684;
var paymentUrl = 'https://demomoney.yandex.ru/eshop.xml';

module.exports = function (express) {
	var router = express.Router();

	router.post('/democheck', function (req, res, next) {
		console.log('democheck', req.body);
		res.json({
			performedDatetime : req.body.requestDatetime,
			invoiceId : req.body.invoiceId, 
			shopId : req.body.shopId,
			code : 0
		});
	});

	router.post('/demoaviso', function (req, res, next) {
		console.log('demoaviso', req.body);
		send(0);
	});

	router.post('/check', function (req, res, next) {
		console.log('check', req.body);
		send(0);
	});

	router.post('/aviso', function (req, res, next) {
		console.log('aviso', req.body);
		send(0);
	});



	return router;
}