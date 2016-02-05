var mongoose = require('../configs/mongoose.js');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
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
	country : String,
	city : {
		type: ObjectId,
		ref : 'City'
	},
	price : [Number],
	best_offer : Boolean,

	benefits : [{
		type : ObjectId,
		ref : 'Benefit'
	}],
	characteristics : String,
	places : [{
		type : ObjectId,
		ref : 'Place'
	}],
	tags : [{
		type : ObjectId,
		ref : 'Tag'
	}],
	created: {
	    type: Date,
	    default: Date.now
	}
});
RestPlace.plugin(deepPopulate);


module.exports = mongoose.model('RestPlace', RestPlace);
