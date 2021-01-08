var jwtHelper = require('../helpers/jwt');

module.exports = (req, res, next) => {
	var token = req.cookies['auth'] || null;
	if (!token) return res.sendStatus(401);
	jwtHelper.verifyToken(token)
		.then(data => {
			res.locals.user = data;
			next();
		})
		.catch(() => {
			console.log(err);
			return res.sendStatus(401);
		})
}