var mongoose = require('../configs/mongoose.js');
Schema = mongoose.Schema;

var File = new Schema({
	name : String,
	path : String
});

module.exports = mongoose.model('File', File);
