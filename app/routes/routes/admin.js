// Middleware: Check if user has admin status
module.exports = (req, res, next) => {
	// _role: 0 <- admin 
	if (res.locals._role == 0) {
		return next();
	} else {
		return res.status(401).json({
			Error: "You do not have permission to perform this action"
		});
	}
}
