var User = require('../models/User');

module.exports = function(req, res, next) {

    res.locals.user = req.user || null;

    if (req.session.update_user) {
		User.findById(req.user._id, function (err, user) {
			if (err) return next(err);
			res.locals.user = user;
			req.session.update_user = false;
		});
	}

    next();
    
};