module.exports = function(req, res, next) {

    if (!req.user) {
		if (req.headers.referer && req.headers.referer.match(req.headers.host)) {
			req.session.redirect_url = req.headers.referer;
		}
    }

    next();
    
};