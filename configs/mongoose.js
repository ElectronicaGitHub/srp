var mongoose = require('mongoose');
var config = require('./config_file');
var log = require('./logger')(module);

if (!process.env.NODE_ENV) {
	mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));
	log.info('connecting to production database');
}

module.exports = mongoose;
