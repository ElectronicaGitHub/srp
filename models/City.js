var mongoose = require('../configs/mongoose.js');
Schema = mongoose.Schema;

var City = new Schema({
	name : String
});

module.exports = mongoose.model('City', City);
