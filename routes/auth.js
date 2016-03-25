var passport = require('passport');
var VKontakteStrategy = require('passport-vkontakte').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var VKONTAKTE_APP_ID = 5362480;
var VKONTAKTE_APP_SECRET = 'OwxwUmHMQhQ9zwmKqjNZ';

var FACEBOOK_APP_ID = 233517303667304;
var FACEBOOK_APP_SECRET = '75d1a5d107faa542fd55ba22462ea9c8';

var User = require('../models/User.js');

passport.use(new VKontakteStrategy({
    clientID:     VKONTAKTE_APP_ID, // VK.com docs call it 'API ID'
    clientSecret: VKONTAKTE_APP_SECRET,
    callbackURL:  "serpantin.moscow/auth/vk/callback"
}, function(accessToken, refreshToken, params, profile, done) {

		User.findOne({ vk_id : profile.id }, function (err, user) {
			if (!user) {
				User.create({
					name : profile.displayName,
					url : profile.profileUrl,
					image : profile.photos[0].value,
					vk_id : profile.id,
					email : params.email
				}, function (err, usr) {
					return done(null, usr);
				});
			} else {
				return done(null, user);
			}
		});
	}
));

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "serpantin.moscow/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
}, function(accessToken, refreshToken, params, profile, done) {

	User.findOne({ facebook_id : profile.id }, function (err, user) {
		if (!user) {
			User.create({
				name : profile.displayName,
				url : 'http://facebook/' + profile.id,
				image : 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large',
				facebook_id : profile.id,
				email : profile._json.email
			}, function (err, usr) {
				return done(null, usr);
			});
		} else {
			return done(null, user);
		}
	});
}));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

module.exports = function (express) {
	var router = express.Router();

	// VK

	router.get('/vk', passport.authenticate('vkontakte', { scope : ['email']}), function (req, res, next) {
		console.log('vk');
	});

	router.get('/vk/callback', passport.authenticate('vkontakte', { failureRedirect: '/login' }), function (req, res, next) {
		res.redirect(req.session.redirect_url);
	});

	// FB

	router.get('/facebook', passport.authenticate('facebook'), function (req, res, next) {
		console.log('facebook');
	});

	router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function (req, res, next) {
		res.redirect(req.session.redirect_url);
	});


	// LOGOUT

	router.get('/logout', function(req, res){
		req.logout();
		res.redirect(req.headers.referer);
	});

	return router;
};