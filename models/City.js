var mongoose = require('../configs/mongoose.js');
Schema = mongoose.Schema;

var City = new Schema({
	name : String,
	deleted : {
		type : Boolean, 
		default : false
	}
});

module.exports = mongoose.model('City', City);
