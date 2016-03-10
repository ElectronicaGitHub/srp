var mongoose = require('../configs/mongoose.js');
Schema = mongoose.Schema;
ObjectId = Schema.Types.ObjectId;

var City = new Schema({
	name : String,
	name_url : String,
	popular : Boolean,
	description : String,
	description_mini : String,
	deleted : {
		type : Boolean,
		default : false
	},
	image : {
		type : ObjectId,
		ref : 'Img'
	}
});

module.exports = mongoose.model('City', City);
