var User = require('../models/User');

module.exports = function(req, res, next) {

    res.locals.user = req.user || null;
    next();
    
};