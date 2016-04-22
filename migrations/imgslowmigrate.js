var path = require('path');
var async = require('async');
var fs = require('fs');
var gm = require('gm');
var mongoose = require('../configs/mongoose');
var config = require('../configs/config_file');
var Img = require('../models/Img.js');

mongoose.connection.on('open', function () {
});

// Img.find({}, function (err, results) {
Img.find({ path_low : null }, function (err, results) {
    console.log(results.length);
    console.log('test');

    results.forEach(function (each) {
        console.log(each.path, each.name);
        var filename = 'low_' + makeID() + 'uid' + each.name;
        var p = path.join(__dirname, "public/attachments/" + filename);
        gm(path.join(__dirname, 'public' + each.path))
        .quality(40)
        .write(p, function (err) {
            if (err) console.log(err);
            if (!err) {
                var path_low = '/attachments/' + filename;
                each.path_low = path_low;
                each.save();
            }
        });
    });
});

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