var mongoose = require('../configs/mongoose.js');
Schema = mongoose.Schema;

var _Image_ = new Schema({
	name : String,
	path : String
})

module.exports = mongoose.model('Image', _Image_);
