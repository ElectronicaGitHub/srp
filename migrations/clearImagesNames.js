// var path = require('path');
// var async = require('async');
// var fs = require('fs');
// var gm = require('gm');
// var mongoose = require('../configs/mongoose');
// var config = require('../configs/config_file');
// var Img = require('../models/Img.js');

// mongoose.connection.on('open', function () {
// });

// Img.find({}, function (err, results) {

//     var n = 0;
//     async.each(results, function (img, callback) {

//         var extension_regex = /\.[0-9a-z]+$/i;

//         var ext = img.path.match(extension_regex);

//         if (ext) {
//             var new_filename = makeID() + 'uid' + ext;
//             var new_filename_low = 'low_' + makeID() + 'uid' + ext;

//             var p = path.join(__dirname, "../public/" + img.path);
//             var p_low = path.join(__dirname, "../public/" + img.path_low);

//             var p = path.join(__dirname, "../public/" + new_filename);
//             var p_low = path.join(__dirname, "../public/" + new_filename_low);

//             // console.log(p, p_low);
//             // 
//             fs.readFile(p, function (err, ok) {
//                 if (err) console.log(err);
//                 console.log(ok);
//             })
            
//             var model_new_p = "/attachments/" + new_filename;
//             var model_new_p_low = "/attachments/low_" + new_filename;

//             img.path = new_p;
//             img.path_low = new_p_low;

//             // fs.rename(p, new_p, function (err, ok1) {
//             //     if (err) console.log(err);
//             //     console.log('ok1');
//             //     fs.rename(p_low, new_p, function (err, ok2) {  
//             //         if (err) console.log(err);
//             //         console.log('ok2');
//             //         img.save(callback);
//             //     });
//             // });

//             callback(null);
//         }

//     }, function (err, ok) {
//         if (err) console.log(err);
//     });
// });

// var makeID = function() {
//   function s4() {
//     return Math.floor((1 + Math.random()) * 0x10000)
//                .toString(16)
//                .substring(1);
//     }
//     var d = s4() + s4() + '-' + s4() + '-' + s4() + '-' +
//            s4() + '-' + s4() + s4() + s4(); 
//     return d;
// };