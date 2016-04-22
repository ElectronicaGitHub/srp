var mongoose = require('../configs/mongoose.js');

Schema = mongoose.Schema;
ObjectId = Schema.Types.ObjectId;

var InvId = new Schema({
	n : Number
});

module.exports = mongoose.model('InvId', InvId);
