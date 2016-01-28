var mongoose = require('../configs/mongoose.js');
Schema = mongoose.Schema;

var Tag = new Schema({
	name : String
});

module.exports = mongoose.model('Tag', Tag);
