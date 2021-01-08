// Utilities
const router = require('express').Router();
const mongoose = require("mongoose");
const geoip = require('geoip-lite');
const verifyToken = require('../middleware/verifyToken');
// Models
const Task = require('../../models/Task');
const Log = require('../../models/TaskLog');
const User = require('../../models/User');
// Routes



// Get User's Tasks
router.get('/tasks', verifyToken, (req, res) => {
	User
		.findById(res.locals.user._id)
		.select('tasks._id tasks.task tasks.logs tasks.streak tasks.isLogged')
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
router.delete('/task', (req, res) => {
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
router.delete('/', (req, res) => {
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
router.get('/requests', (req, res) => {
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
router.get('/search', (req, res) => {
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

router.post('/follow', (req, res) => {
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

router.post('/accept', (req, res) => {
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
router.get('/logs', isFollowing, (req, res) => {
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

router.get('/:id', (req, res) => {
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