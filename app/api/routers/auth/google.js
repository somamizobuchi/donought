var router = require('express').Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../../../models/User');
var jwt = require('jsonwebtoken');

// PassportJs Middleware Initialize
router.use(passport.initialize());

// Conifgure new Google Strategy
passport.use(new GoogleStrategy({
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: "http://localhost:5000/api/auth/google/callback"
}, (_accessToken, _refreshToken, profile, done) => {

	User.findOneAndUpdate({ googleId: profile.id }, { picture: profile.photos[0].value })
		.exec()
		.then(doc => {
			if (doc) {
				return doc;
			} else {
				return User.create({
					firstname: profile.name.givenName,
					lastname: profile.name.familyName,
					googleId: profile.id,
					picture: profile.photos[0].value
				})
			}
		})
		.then(doc => {
			done(null, doc);
		})
		.catch(err => {
			done(err, null)
		})
}
));

// path: api/auth/google 
router.get('/', passport.authenticate('google', {
	session: false,
	scope: ['https://www.googleapis.com/auth/plus.login']
}));

// path: api/auth/google/callback
// - Generate user if not defined
// - Create token if user exists
router.get('/callback', passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:4000/' }), (req, res) => {
	var token = jwt.sign({
		_id: req.user._id,
	}, process.env.JWT_KEY)
	res.status(200).cookie('auth', token).redirect('http://localhost:4000/');
});

module.exports = router;