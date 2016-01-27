var mongoose = require('../configs/mongoose.js');
Schema = mongoose.Schema;
ObjectId = Schema.Types.ObjectId;

var RestPlace = new Schema({
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
	mini_images : {
		type : [ObjectId],
		ref : 'Image'
	},
	images : {
		type : [ObjectId],
		ref : 'Image'
	},
	coordinates : {
		type: [Number],
		required: true
	},
	adress : {
		type: String,
		required: true
	},
	tags : {
		type : [String]
	},
	benefits : {
		type : [String]
	},
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
