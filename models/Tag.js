var mongoose = require('../configs/mongoose.js');
Schema = mongoose.Schema;

var Tag = new Schema({
	name : String,
	name_url : String,
	popular : Boolean,
	description : String,
	seo_title : String,
	seo_description : String,
	deleted : {
		type : Boolean,
		default : false
	},
	image : {
		type : ObjectId,
		ref : 'Img'
	}
});

module.exports = mongoose.model('Tag', Tag);
