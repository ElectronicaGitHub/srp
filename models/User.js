var mongoose = require('../configs/mongoose.js');
Schema = mongoose.Schema;
ObjectId = Schema.Types.ObjectId;

var User = new Schema({
	name : String,
	vk_id : String,
	facebook_id : String,
	odnoklassniki_id : String,
	image : String,
	email : String,
	url : String,
	requests : [{
		type : ObjectId,
		ref : 'Request'
	}]
});

module.exports = mongoose.model('User', User);
