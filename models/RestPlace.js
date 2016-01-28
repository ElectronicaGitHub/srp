var mongoose = require('../configs/mongoose.js');
Schema = mongoose.Schema;
ObjectId = Schema.Types.ObjectId;

var RestPlace = new Schema({
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
	mini_images : [{
		type : ObjectId,
		ref : 'Img'
	}],
	images : [{
		type : ObjectId,
		ref : 'Img'
	}],
	coordinates : {
		type: [Number],
		required: true
	},
	adress : {
		type: String,
		required: true
	},
	tags : [{
		type : ObjectId,
		ref : 'Tag'
	}],
	benefits : [{
		type : ObjectId,
		ref : 'Benefit'
	}],
	characteristics : String,
	places : {
		type : [ObjectId],
		ref : 'Place'
	},
	created: {
	    type: Date,
	    default: Date.now
	}
});

module.exports = mongoose.model('RestPlace', RestPlace);
