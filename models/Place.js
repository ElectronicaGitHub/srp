var mongoose = require('../configs/mongoose.js');
Schema = mongoose.Schema;
ObjectId = Schema.Types.ObjectId;

var Place = new Schema({
	title : {
		type: String,
		required: true
	},
	title_url : {
		type: String,
		required: true
	},
	description_full : {
		type: String,
		required: true
	},
	description_mini : {
		type: String,
		required: true
	},
	coordinates : {
		type: [Number],
		required: true
	},
	adress : {
		type: String,
		required: true
	},
	country : String,
	city : {
		type: ObjectId,
		ref : 'City'
	},
	images : [{
		type : ObjectId,
		ref : 'Img'
	}],
	type : String,
	created: {
	    type: Date,
	    default: Date.now
	}
});

module.exports = mongoose.model('Place', Place);
