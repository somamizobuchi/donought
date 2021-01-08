var jwt = require('jsonwebtoken');

module.exports = {
	verifyToken: (token) => {
		return new Promise((resolve, reject) => {
			jwt.verify(token, process.env.JWT_KEY, (err, data) => {
				if (err) return reject(err);
				return resolve(data);
			})
		});
	},
	createToken: (data) => {
		return new Promise((resolve, reject) => {
			jwt.sign(data, process.env.JWT_KEY, { expiresIn: '1h' }, (err, token) => {
				if (err) return reject(err);
				return resolve(token);
			})
		})
	}
}