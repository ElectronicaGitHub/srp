var mongoose = require('../configs/mongoose.js');
Schema = mongoose.Schema;
ObjectId = Schema.Types.ObjectId;

var Request = new Schema({
	hotel : {
		type : ObjectId,
		ref : 'RestPlace'
	},
	owner : {
		type : ObjectId,
		ref : 'User'
	},
	tariff : Number,
	owner_name : String,
	count : String,
	phone : String,
	dates : String,
	price : Number,
	final_price : Number,
	status : {
		type : Number,
		default : 0
	}
});

module.exports = mongoose.model('Request', Request);
