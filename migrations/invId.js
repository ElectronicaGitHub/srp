var InvId = require('../models/InvId.js');

InvId.findOne({}, function (err, finded) {
	if (!finded) {
		InvId.create({ n : 1 }, function (err, ok) {
			if (err) console.log(err);
			console.log('Создание INV ID');
		})
	} else {
		console.log('INV ID уже создано');
	}
});
