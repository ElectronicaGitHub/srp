var mongoose = require('../configs/mongoose.js');
Schema = mongoose.Schema;
ObjectId = Schema.Types.ObjectId;

var Benefit = new Schema({
	name : String,
	image : {
		type : ObjectId,
		ref : 'Img'
	}
});

module.exports = mongoose.model('Benefit', Benefit);
