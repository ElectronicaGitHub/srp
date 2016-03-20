var passport = require('passport');
var VKontakteStrategy = require('passport-vkontakte').Strategy;

var VKONTAKTE_APP_ID = 5362480;
var VKONTAKTE_APP_SECRET = 'OwxwUmHMQhQ9zwmKqjNZ';

var User = require('../models/User.js');

passport.use(new VKontakteStrategy({
    clientID:     VKONTAKTE_APP_ID, // VK.com docs call it 'API ID'
    clientSecret: VKONTAKTE_APP_SECRET,
    callbackURL:  "http://localhost:8080/auth/vk/callback" }, function(accessToken, refreshToken, profile, done) {

		console.log('need to find or create User', profile);
		User.findOne({ vk_id : profile.id }, function (err, user) {
			if (!user) {
				User.create({
					name : profile.displayName,
					url : profile.profileUrl,
					image : profile.photos[0].value,
					vk_id : profile.id
				}, function (err, usr) {
					return done(null, usr);
				});
			} else {
				return done(null, user);
			}
		});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

module.exports = function (express) {
	var router = express.Router();

	router.get('/vk', passport.authenticate('vkontakte'), function (req, res, next) {
		console.log('vk');
	});

	router.get('/vk/callback', passport.authenticate('vkontakte', { failureRedirect: '/login' }), function (req, res, next) {
		res.redirect(req.headers.referer);
	});

	router.get('/vk/logout', function(req, res){
		req.logout();
		console.log(req.user, res.locals);
		res.redirect('/');
	});

	return router;
};