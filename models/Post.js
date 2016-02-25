var mongoose = require('../configs/mongoose.js');
Schema = mongoose.Schema;

var Post = new Schema({
	title : String,
	title_url : String,
	description_mini : String,
	description : String
});

module.exports = mongoose.model('Post', Post);
