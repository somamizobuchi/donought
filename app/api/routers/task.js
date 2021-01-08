const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken')
// const auth = require('./auth');
// router.use('*', auth);
// const isAdmin = require('./admin');
const moment = require('moment')
// Models
const User = require('../../models/User');
const Task = require('../../models/Task');
const Log = require('../../models/TaskLog');

// Get all tasks
router.get('/', (req, res) => {
	Task.aggregate()
		.match({})
		.project({
			title: 1,
			description: 1,
			category: 1,
			numUsers: { $size: '$users' }
		})
		.exec((err, docs) => {
			if (err) return res.status(500).send(err);
			return res.status(200).send(docs);
		})
})


// New Task
router.post('/new', (req, res) => {
	// Determine if task w title exists
	Task.exists({ title: req.body.title }, (err, exists) => {
		if (err) {
			return res.send(500).json({
				ok: false,
				message: "Internal Server Error"
			})
		}

		// Check if task already exists
		if (exists) return res.status(409).json({
			ok: false,
			message: "A task with that title already exists"
		})


		// Create new task model object
		const task = new Task({
			title: req.body.title,
			description: req.body.description,
			category: req.body.category
		});

		// Save task
		task.save((err, doc) => {
			if (err) {
				return res.status(500).json({
					Error: "Internal server error"
				})
			}
			// Successfully Created document
			return res.status(200).json(doc);
		})
	})
})

// Delete task
router.delete('/delete', (req, res) => {
	const task_id = req.body.tid;
	// Deleting task from tasks
	Task.findByIdAndDelete(task_id, (err, doc) => {
		if (err) return res.status(500).json({
			ok: false,
			message: err.message
		})
		// Deleting all user tasks
		User.updateMany({}, { $pull: { tasks: { task: req.body.tid } } }, (err, doc) => {
			if (err) return res.status(500).json({
				ok: false,
				message: err.message
			})
			// Deleting all logs
			Log.deleteMany({ task: req.body.tid }, err => {
				if (err) res.status(500).json({
					ok: false,
					message: err.message
				})
				return res.status(200).json({
					ok: true,
					message: "Successfully deleted task id " + doc._id
				})
			})
		})
	})
})

// Join a Task
router.get('/join/:tid', verifyToken, (req, res) => {
	const _id = res.locals.user._id
	Task.findByIdAndUpdate({ _id: req.params.tid }, {
		$addToSet: { users: _id }
	}, (err, task) => {
		if (err) return res.status(500).send(err);
		if (!task) return res.status(404).json({
			ok: false,
			message: "no tasks found"
		})
		User.exists({ _id: _id, 'tasks.task': req.params.tid }, (err, exists) => {
			if (err) return res.status(500).json({
				ok: false,
				message: "Internal Server Error"
			})
			if (exists) return res.status(409).json({
				ok: false,
				message: "You have already joined this Donought"
			})
			User.findByIdAndUpdate(
				_id,
				{
					$addToSet: { tasks: { task: req.params.tid } }
				}, (err, user) => {
					if (err) return res.status(500).json(err);
					return res.status(200).json({
						ok: true,
						message: "Successfully joined this Donought!"
					});
				})
		})
	})
})


// Add a log
router.post('/log', verifyToken, (req, res) => {
	const uid = res.locals.user._id;
	const tid = req.body.tid;
	console.log(tid);
	Log.findOne({
		user: uid,
		task: tid
	})
		.sort({ createdAt: -1 })
		.exec()
		.then(log => {
			console.log("Checking if log already exists for this day...")
			if (log) {
				const timezone = "America/New_York"
				const startOfDay = moment.tz(timezone).startOf('day');
				const createdAt = moment.tz(log.createdAt, timezone);
				// Check if already logged today
				if (createdAt.isAfter(startOfDay)) throw { code: 409 };
			}
			return
		})
		.then(() => {
			console.log("Creating new log...");
			const newLog = new Log({
				success: req.body.success,
				comment: req.body.comment,
				task: tid,
				user: uid
			})
			return newLog.save()
		})
		.then(log => {
			console.log("adding log to user");
			const update = req.body.success ? {
				$addToSet: { 'tasks.$.logs': log._id },
				$inc: { 'tasks.$.streak': 1 },
				$set: {
					'tasks.$.isLogged': true
				}
			} : {
					$addToSet: { 'tasks.$.logs': log._id },
					$set: {
						'tasks.$.streak': 0,
						'tasks.$.isLogged': true
					}
				}
			return User.findOneAndUpdate({
				_id: uid,
				tasks: { $elemMatch: { _id: req.body.tid } }
			}, update).exec()
		})
		.then(() => {
			return res.sendStatus(200)
		})
		.catch(err => {
			console.log(err)
			if (err.code) return res.sendStatus(err.code);
			return res.sendStatus(500);
		})
})

// get logs
router.get('/logs', (req, res) => {
	let uid = res.locals._id;
	let tid = req.body.tid;
	let ndays = req.body.ndays;
	let n_days_ago = moment().tz(res.locals.timezone).subtract(ndays, 'days').startOf('day');
	Log.find({
		user: uid,
		task: tid,
		createdAt: { $gte: n_days_ago.format() }
	}, 'success createdAt comment')
		.sort({ createdAt: -1 })
		.exec((err, doc) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					message: "Internal server error"
				})
			} else {
				if (doc) {
					let j = 0;
					var out = new Array(ndays);
					var day;
					for (i = 0; i < ndays; i++) {
						day = n_days_ago.add(1, 'days');
						if (day.isSame(moment.tz(doc[j].createdAt, res.locals.timezone), 'day')) {
							out[i] = doc[j]
							j += 1;
						} else {
							out[i] = {
								_id: null,
								success: null,
								createdAt: day.format(),
								comment: null
							}
						}
					}
					return res.status(200).json({
						ok: true,
						out
					})
				}
			}
		})
})


module.exports = router