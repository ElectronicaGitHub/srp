var crypto = require('crypto');
var md5 = require('md5');
var Request = require('../models/Request.js');

var robokassa = {
	env : {
		prod : {
			alg : 'MD5',
			pass1 : 'Cr1jM4R4aBqtu44dHNjL',
			pass2 : 'ok60uz6DdquqDHF7rL1V'
		},
		test : {
			alg : 'MD5',
			pass1 : 'Q3mYKRLEpNnO96Hz8mQ7',
			pass2 : 'lv0N2J1ozoDMi9ad0fxo'
		},
	},
	base : 'https://auth.robokassa.ru/Merchant/Index.aspx',
	login : 'serpantinmoscow',
	urls : {
		methods : 'POST, POST, POST',
		result : 'serpantin.moscow/result',
		success : 'serpantin.moscow/success',
		fail : 'serpantin.moscow/fail'
	}
}

module.exports = function  (express) {
	var router = express.Router();

	router.post('/link', function (req, res, next) {
	    link = {
	    	// InvId : 2147483647 ((2^31) - 1)
	    	isTest : 1,
	    	MerchantLogin : robokassa.login,
	    	OutSum : req.body.sum + '.00',
	    	InvDesc: "Оплата услуг по организации вашего отдыха",
	    	SignatureValue : md5([robokassa.login, req.body.sum, '', robokassa.env['test'].pass1].join(':')),
	    	Encoding : 'UTF-8',
	    	shp_payId: req.body.id
	    };
	    res.json({
	    	base : robokassa.base,
	    	link : link
	    });
	});
	
	router.get('/result', function (req, res, next) {
		res.send(1);
	});
	
	router.get('/success', function (req, res, next) {
		Request.findByIdAndUpdate(req.query.shp_payId, { status : 2 }, function (err, result) {
			if (err) console.log(err);
			res.redirect('/cabinet');
		});
	});

	router.get('/fail', function (req, res, next) {
		res.redirect('/cabinet');
	});

	return router;
	
}

function hash(data) {
	console.log(data);
	return crypto.createHash('md5')
		.update(data)
		.digest('hex');
}

// module.exports = function (express) {
// 	var router = express.Router();

// 	// TEST HANDLERS

// 	router.post('/democheck', function (req, res, next) {
// 		console.log('democheck', req.body);
// 		var data = {
// 			performedDatetime : req.body.requestDatetime,
// 			invoiceId : req.body.invoiceId, 
// 			shopId : req.body.shopId,
// 			code : 0
// 		};

// 		var xmlbody = '<checkOrderResponse performedDatetime="' + data.performedDatetime + 
// 						'" code="' + data.code + 
// 						'" invoiceId="' + data.invoiceId + 
// 						'" shopId="' + data.shopId + '"/>';

// 		res.end(xmlbody);
// 	});

// 	router.post('/demoaviso', function (req, res, next) {
// 		console.log('demoaviso', req.body);
// 		var data = {
// 			performedDatetime : req.body.requestDatetime,
// 			invoiceId : req.body.invoiceId, 
// 			shopId : req.body.shopId,
// 			code : 0
// 		};

// 		var xmlbody = '<paymentAvisoResponse performedDatetime="' + data.performedDatetime + 
// 						'" code="' + data.code + 
// 						'" invoiceId="' + data.invoiceId + 
// 						'" shopId="' + data.shopId + '"/>';

// 		Request.findByIdAndUpdate(req.body.orderNumber, { status : 2 }, function (err, result) {
// 			res.end(xmlbody);
// 		});
// 	});

// 	// REAL HANDLERS

// 	router.post('/check', function (req, res, next) {
// 		var data = {
// 			performedDatetime : req.body.requestDatetime,
// 			invoiceId : req.body.invoiceId, 
// 			shopId : req.body.shopId,
// 			code : 0
// 		};

// 		var xmlbody = '<checkOrderResponse performedDatetime="' + data.performedDatetime + 
// 						'" code="' + data.code + 
// 						'" invoiceId="' + data.invoiceId + 
// 						'" shopId="' + data.shopId + '"/>';

// 		res.end(xmlbody);
// 	});

// 	router.post('/aviso', function (req, res, next) {
// 		var data = {
// 			performedDatetime : req.body.requestDatetime,
// 			invoiceId : req.body.invoiceId, 
// 			shopId : req.body.shopId,
// 			code : 0
// 		};

// 		var xmlbody = '<paymentAvisoResponse performedDatetime="' + data.performedDatetime + 
// 						'" code="' + data.code + 
// 						'" invoiceId="' + data.invoiceId + 
// 						'" shopId="' + data.shopId + '"/>';

// 		Request.findByIdAndUpdate(req.body.orderNumber, { status : 2 }, function (err, result) {
// 			res.end(xmlbody);
// 		});
// 	});



// 	return router;
// }
