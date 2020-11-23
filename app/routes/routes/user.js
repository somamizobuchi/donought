const router = require('express').Router();
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const auth = require('./auth')
const geoip = require('geoip-lite');
const Task = require('../../models/Task');
const Log = require('../../models/TaskLog')

// Create new User
router.post('/new', async (req, res) => {

	// Check of missing fields
	if (!req.body.email | !req.body.firstname | !req.body.lastname | !req.body.password) {
		return res.status(422).json({
			Error: "missing fields"
		})
	}

	// Email duplicate check
	User.exists({ email: req.body.email }, (err, exists) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				message: err.message
			})
		} else if (exists) {
			return res.status(409).json({
				ok: false,
				message: "A user with that email already exists"
			})
		} else {
			// Obtain IP Address
			var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
			var geo = geoip.lookup(ip) || null;
			var tz = geo ? geo.timezone : 'America/New_York';
			// Hash password
			User.generateHash(req.body.password)
				.then(hash => {
					const newUser = new User({
						firstname: req.body.firstname,
						lastname: req.body.lastname,
						email: req.body.email,
						password: hash,
						_role: 0,
						timezone: tz
					});
					newUser.save((err, doc) => {
						if (err) {
							return res.status(500).json({
								Error: "Database save error"
							})
						}
						// Generate cookie
						var token = jwt.sign({
							_id: doc._id,
							email: doc.email,
							firstname: doc.firstname,
							lastname: doc.lastname,
							_role: doc._role,
							timezone: doc.timezone
						}, process.env.JWT_KEY)
						// Send response
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
			ok: false,
			Error: "Missing fields"
		})
	}
	User.findOne({ email: req.body.email }, (err, user) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				message: "Internal server error"
			})
		}
		if (!user) {
			return res.status(404).json({
				ok: false,
				message: "That user does not exist"
			})
		}
		User.compareHash(req.body.password, user.password)
			.then(same => {
				if (!same) {
					return res.status(401).json({
						ok: false,
						message: "Username and password do not match"
					})
				}
				var token = jwt.sign({
					_id: user._id,
					email: user.email,
					firstname: user.firstname,
					lastname: user.lastname,
					_role: user._role,
					timezone: user.timezone
				}, process.env.JWT_KEY)
				res.status(200).cookie('auth', token).json({
					_id: user._id,
					email: user.email,
					firstname: user.firstname,
					lastname: user.lastname,
					_role: user._role,
					timezone: user.timezone,
					ok: true
				})
			});
	})
})

// Logout
router.get('/logout', (req, res) => {
	// Clear authentication cookie
	res.clearCookie('auth')
	// Return true
	return res.status(200).json({
		ok: true,
		message: "Logged user out"
	});
});

// Check Authorization Status
router.get('/isauth', auth, (req, res) => {
	res.status(200).json({
		_id: res.locals._id,
		firstname: res.locals.firstname,
		lastname: res.locals.lastname,
		timezone: res.locals.timezone,
		email: res.locals.email,
		ok: true
	})
})

// Get User's Tasks
router.get('/tasks', auth, (req, res) => {
	User
		.findById(res.locals._id)
		.select('tasks.task tasks.logs tasks.consecutive tasks.isLogged')
		.populate({
			path: 'tasks.task',
			select: [
				'title',
				'category',
				'description'
			]
		})
		.populate({
			path: 'tasks.logs',
			select: [
				'comment',
				'success',
				'createdAt'
			],
			options: {
				limit: 10
			}
		})
		.exec((err, doc) => {
			if (err) return res.status(500).send(err);
			if (!doc || !doc.tasks) return res.status(404).json({
				ok: false,
				message: "No user found"
			})
			return res.status(200).json(doc.tasks);
		});

})

// Delete a task from user 
router.delete('/task', auth, (req, res) => {
	console.log("Deleting task from user")
	const uid = res.locals._id;
	const tid = req.body.tid;
	User.findByIdAndUpdate(uid, {
		$pull: { tasks: { task: tid } }
	}, (err, doc) => {
		if (err) return res.status(500).json({
			ok: false
		})
		Log.deleteMany({
			user: uid,
			task: tid
		}, err => {
			if (err) return res.status(500).json({
				ok: false,
				message: err.message
			});
			Task.findByIdAndUpdate(tid, {
				$pull: { users: uid }
			}, (err, res) => {
				if (err) return res.status(500).json({
					ok: false,
					message: err.message
				});
			})
		})
		return res.status(200).json(tid)
	})
})
// delete user
router.delete('/', auth, (req, res) => {
	let uid = res.locals._id;
	Task.updateMany({
		users: uid
	}, {
		$pull: { users: res.locals._id }
	}, (err, task) => {
		if (!err) {
			console.log("deleting Logs");
			Log.deleteMany({
				user: uid
			}, (err) => {
				if (!err) {
					console.log("Deleting user")
					User.findByIdAndDelete(
						uid,
						(err, user) => {
							if (!err) {
								console.log(res)
							}
						}
					)
				} else {
					return res.status(500).json({
						ok: false,
						message: err.message
					})
				}
			})
		} else {
			return res.status(500).json({
				ok: false,
				message: err.message
			})
		}
		res.clearCookie('auth');
		return res.status(500).json({
			ok: true,
			message: "Successfully deleted user"
		})
	})
})

module.exports = router