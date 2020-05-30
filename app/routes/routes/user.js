const router = require('express').Router();
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const auth = require('./auth')



// Create new User
router.post('/new', async (req, res) => {

	// Check of missing fields
	if (!req.body.email | !req.body.firstname | !req.body.lastname | !req.body.password) {
		return res.status(422).json({
			Error: "missing fields"
		})
	}
	let password;

	// Email duplicate check
	User.exists({ email: req.body.email }, (err, exists) => {
		if (err) {
			console.log(err);
			return res.status(500).json({
				Error: "Database query error"
			})
		} else if (exists) {
			return res.status(409).json({
				Error: "A user with that email already exists"
			})
		} else {
			// Hash password
			User.generateHash(req.body.password)
				.then(hash => {
					const newUser = new User({
						firstname: req.body.firstname,
						lastname: req.body.lastname,
						email: req.body.email,
						password: hash,
						_role: 0
					});
					newUser.save((err, doc) => {
						if (err) {
							console.log(err);
							return res.status(500).json({
								Error: "Database save error"
							})
						}
						// Generate cookie
						var token = jwt.sign({
							_id: doc._id,
							email: doc.email,
							_role: doc._role
						}, process.env.JWT_KEY)
						res.status(200)
							.cookie('auth', token)
							.json({
								ok: true,
								_id: doc._id,
								email: doc.email
							})
					});
				})
		}
	})
});

// Login User
router.post('/login', (req, res) => {
	if (!req.body.email | !req.body.password) {
		return res.status(422).json({
			Error: "Missing fields"
		})
	}
	User.findOne({ email: req.body.email }, (err, user) => {
		if (err) {
			return res.status(500).json({
				Error: "Database query error"
			})
		}
		if (!user) {
			return res.status(404).json({
				Error: "User does not exist"
			})
		}
		User.compareHash(req.body.password, user.password)
			.then(same => {
				if (!same) {
					return res.status(401).json({
						Error: "Incorrect password"
					})
				}
				var token = jwt.sign({
					_id: user._id,
					email: user.email,
					_role: user._role
				}, process.env.JWT_KEY)
				res.status(200).cookie('auth', token).json({
					_id: user._id,
					email: user.email,
					ok: true
				})
			});
	})
})
// Logout
router.get('/logout', (req, res) => {
	res.clearCookie('auth')
	res.json({
		success: true
	})
})

// Check Authorization Status
router.get('/isauth', auth, (req, res) => {
	res.status(200).json({
		_id: res.locals._id,
		email: res.locals.email,
		ok: true
	})
})

// Get User's Tasks
router.get('/tasks', auth, (req, res) => {
	User
		.findById(res.locals._id)
		.select('tasks.task tasks.logs')
		.populate({
			path: 'tasks.task',
			select: [
				'title',
				'category',
				'description'
			]
		})
		.exec((err, doc) => {
			if (err) return res.status(500).send(err);
			res.status(200).json(doc);
		});

})

module.exports = router