var multiparty = require('multiparty');
var path = require('path');
var fs = require('fs');
var async = require('async');
var RestPlace = require('../models/RestPlace.js');
var Image_ = require('../models/Image.js');
var benefitsData = require('../data/data.js');

module.exports = function (express) {
	var router = express.Router();

	router.get('/', function (req, res, next) {
		res.render('admin', {
			data : benefitsData.hotel
		});
	});

	router.post('/loadImages', function (req, res, next) {

		var form = new multiparty.Form();
		var filesArray = [];
		form.parse(req, function(err, fields, files) {
			async.each(files, function (file, cb) {
				fileSave(file, function (readyFile) {
					filesArray.push(readyFile);
					cb(null);
				}, function (err) {
					res.json({message : err});
				});
			}, function (err) {
				if (err) return next(err);
				res.json({ message : 'ok' , filesArray : filesArray });
			})

		});

		// removeFile = function(file, cb) {
		//     fs.unlink(file, function(err) {
	    //         if (err) throw err;
	    //         console.log('file in path', file, 'successfully deleted');
	    //  	   cb();
		// 	   });
		// }
	});

	router.post('/place', function (req, res, next) {
		var body = req.body;

		var rp = new RestPlace(body);

		rp.save(function (err, model) {
			console.log(arguments);
			res.json({
				message : 'ok'
			});
		});
	});



	return router;
}

var fileSave = function (file, cb, cbFail) {
	file = file[0];
	if (file.size > (300 * 1024)) {
  		cbFail({
  			message : 'Файл превышает указанный размер в 300 Кб.'
  		});
  	} else {
      	var filename = makeID() + 'uid' + file.originalFilename;
      	async.waterfall([
      		function (callback) {
		      	// сохранить файл в фс
			  	var p = path.join(__dirname, "../public/attachments/" + filename);
      			fs.readFile(file.path, function (err, data) {
      				if (err) callback(err);
					fs.writeFile(p, data, function (err) {
						var realPath = '/attachments/' + filename;
						if (err) callback(err);
						callback(null, realPath);
					});
				});
      		},
      		function (path, callback) {
		      	// добавить модель файла
		      	var img = new Image_({
		      		name : file.originalFilename,
		      		path : path
		      	})
		      	img.save(function (err, att) {
		      		if (err) callback(err);
		      		callback(null, att);
		      	})	
      		}
      	], function (err, attachment) {
      		if (err) cbFail({ message : err });
      		cb(attachment);
      	})
  	}
}

var makeID = function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  	}
  	var d = s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4(); 
    return d;
};