// Utilities
const router = require('express').Router();
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const geoip = require('geoip-lite');
// Models
const Task = require('../../models/Task');
const Log = require('../../models/TaskLog');
const User = require('../../models/User');
// Middleware
const auth = require('./auth')
// Routes
const image = require('./image');


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
//logout
router.get('/logout', (req, res) => {
	// Clear authentication cookie
	res.clearCookie('auth')
	// Return true
	return res.status(200).json({
		ok: true,
		message: "Logged user out"
	});
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
		bcrypt.compare(req.body.password, user.password)
			.then(match => {
				if (!match) {
					return res.status(401).json({
						ok: false,
						message: "Username and password do not match"
					})
				} else {
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
				}
			})
	});
})

// Logout


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
// Get requests
router.get('/requests', auth, (req, res) => {
	User.findOne({ _id: res.locals._id, followers: { $elemMatch: { accepted: false } } })
		.select('followers.$')
		.populate({
			path: 'followers.user',
			select: [
				'firstname',
				'lastname'
			]
		})
		.exec((err, doc) => {
			if (!err) {
				return res.status(200).json({
					ok: true,
					doc
				})
			} else {
				res.status(500).json({
					ok: false,
					message: "Internal Server Error"
				})
				console.log(err)
			}
		})
})
// Search 
router.get('/search', auth, (req, res) => {
	const searchText = "^" + req.query.text;
	const regexp = new RegExp(searchText, "i",);
	User.find({
		firstname: regexp
	})
		.limit(10)
		.select('firstname lastname')
		.exec((err, doc) => {
			if (err) {
				console.log(err.message)
				return res.status(500).json({
					ok: false,
					message: "Something went wrong"
				})
			} else {
				return res.status(200).json({
					ok: true,
					doc: doc
				})
			}
		})
})

router.post('/follow', auth, (req, res) => {
	const user_id_to_follow = req.body._id;
	const user_id = res.locals._id;

	if (user_id === user_id_to_follow) {
		return res.status(400).json({
			ok: false,
			message: "Cannot follow yourself"
		})
	}

	var update01 = {
		$addToSet: {
			followers: {
				user: user_id,
				accepted: false
			}
		}
	}
	var update02 = {
		$addToSet: {
			following: {
				user: user_id_to_follow,
				accepted: false
			}
		}
	}

	User.findOneAndUpdate({
		_id: user_id_to_follow,
		'followers.user': { $ne: user_id }
	}, update01, (err, doc) => {
		if (!err) {
			if (doc !== null) {
				User.findOneAndUpdate({
					_id: user_id,
					'following.user': { $ne: user_id_to_follow }
				}, update02, (err, doc) => {
					if (!err) {
						return res.status(200).json({
							ok: true,
							message: "Follow requested"
						})
					}
				})
			} else {
				return res.status(409).json({
					ok: true,
					message: "Follow request already exists"
				})
			}
		} else {
			return res.status(500).json({
				ok: false,
				message: "Internal Server Error"
			})
		}
	})

})

router.post('/accept', auth, (req, res) => {
	User.findOneAndUpdate({
		_id: res.locals._id,
		followers: { $elemMatch: { user: req.body._id } }
	}, {
		$set: {
			'followers.$.accepted': true
		}
	}, (err, doc) => {
		if (err) {
			return res.status(500).json(
				{
					ok: false,
					message: err.message
				}
			)
		} else {
			User.findOneAndUpdate({
				_id: req.body._id,
				following: { $elemMatch: { user: res.locals._id } }
			}, {
				$set: {
					'following.$.accepted': true
				}
			}, (err, doc) => {
				if (err) {
					return res.status(500).json(
						{
							ok: false,
							message: err.message
						}
					)
				} else {
					return res.status(200).json({
						ok: true,
						doc
					})
				}
			})
		}
	})
})

// isFollower Middleware
const isFollowing = (req, res, next) => {
	User.find({
		_id: req.body._id,
		followers: { $elemMatch: { user: res.locals._id } }
	})
		.exec((err, doc) => {
			console.log(doc);
			if (err) return res.status(500).json({
				ok: false,
				message: err.message
			})
			else {
				if (doc) {
					return next();
				} else {
					return res.status(401).json({
						ok: false,
						message: "You are not authorized to view this"
					})
				}
			}
		})
}
// Get user logs
router.get('/logs', auth, isFollowing, (req, res) => {
	Log.find({ user: req.body._id })
		.populate({
			path: 'task',
			select: [
				'title'
			]
		})
		.populate({
			path: 'user',
			select: [
				'firstname',
				'lastname'
			]
		})
		.limit(5)
		.exec((err, doc) => {
			if (err) return res.status(500).json({
				ok: false,
				message: err.message
			})
			else {
				return res.status(200).json({
					ok: true,
					doc: doc
				})
			}
		})
})
// Upload 
router.use('/image', image);

router.get('/:id', auth, (req, res) => {
	const id = mongoose.Types.ObjectId(req.params.id);
	User.aggregate()
		.match({ _id: id })
		.lookup({
			from: 'files',
			localField: 'images',
			foreignField: '_id',
			as: 'images'
		})
		.project({
			image: { $arrayElemAt: ['$images', 0] },
			firstname: 1,
			lastname: 1
		})
		.exec()
		.then(doc => {
			return res.status(200).json({
				ok: true,
				user: doc
			})
		})
		.catch(err => {
			return res.status(500).json({
				ok: false,
				message: err.message
			})
		})
})


module.exports = router