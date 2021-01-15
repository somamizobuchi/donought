var router = require('express').Router();
var jwtHelper = require('../../helpers/jwt');
var googleRouter = require('./google');
var User = require('../../../models/User');


router.get('/', (req, res) => {
	var token = req.cookies['auth'] || null;
	if (!token) return res.sendStatus(401);
	jwtHelper.verifyToken(token)
		.then(data => {
			return User.findById(data._id)
				.select([
					'firstname',
					'lastname',
					'picture',
					'_role'
				])
				.exec()
		})
		.then(user => {
			if (!user) return res.sendStatus(404);
			return res.status(200).json({ user });
		})
		.catch(err => {
			console.log(err);
			return res.sendStatus(500);
		})
})

router.get('/signout', (req, res) => {
	req.logout();
	res.clearCookie('auth');
	res.sendStatus(200);
})

router.use('/google', googleRouter);


module.exports = router;