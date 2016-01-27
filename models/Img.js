var mongoose = require('../configs/mongoose.js');
Schema = mongoose.Schema;

var Img = new Schema({
	name : String,
	path : String
})

module.exports = mongoose.model('Img', Img);
