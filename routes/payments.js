var shopId = 51180;
var scid = 533684;
var paymentUrl = 'https://demomoney.yandex.ru/eshop.xml';
var Request = require('../models/Request.js');

module.exports = function (express) {
	var router = express.Router();

	router.post('/democheck', function (req, res, next) {
		console.log('democheck', req.body);
		var data = {
			performedDatetime : req.body.requestDatetime,
			invoiceId : req.body.invoiceId, 
			shopId : req.body.shopId,
			code : 0
		};

		var xmlbody = '<checkOrderResponse performedDatetime="' + data.performedDatetime + 
						'" code="' + data.code + 
						'" invoiceId="' + data.invoiceId + 
						'" shopId="' + data.shopId + '"/>';

		res.end(xmlbody);
	});

	router.post('/demoaviso', function (req, res, next) {
		console.log('demoaviso', req.body);
		var data = {
			performedDatetime : req.body.requestDatetime,
			invoiceId : req.body.invoiceId, 
			shopId : req.body.shopId,
			code : 0
		};
		
		var xmlbody = '<paymentAvisoResponse performedDatetime="' + data.performedDatetime + 
						'" code="' + data.code + 
						'" invoiceId="' + data.invoiceId + 
						'" shopId="' + data.shopId + '"/>';

		Request.findByIdAndUpdate(req.body.orderNumber, { status : 2 }, function (err, result) {
			res.end(xmlbody);
		});
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