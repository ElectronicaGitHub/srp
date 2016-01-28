var mongoose = require('../configs/mongoose.js');
Schema = mongoose.Schema;
ObjectId = Schema.Types.ObjectId;

var Place = new Schema({
	title : {
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
	mini_images : [{
		type : ObjectId,
		ref : 'Img'
	}],
	images : [{
		type : ObjectId,
		ref : 'Img'
	}],
	tags : {
		type : [String]
	},
	benefits : {
		type : [String]
	},
	created: {
	    type: Date,
	    default: Date.now
	}
});

module.exports = mongoose.model('Place', Place);
