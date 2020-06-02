const router = require('express').Router();
const auth = require('./auth');
router.use('*', auth);
const isAdmin = require('./admin');
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
router.post('/new', isAdmin, (req, res) => {
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
router.delete('/delete', isAdmin, (req, res) => {
	const task_id = req.body.tid;
	Task.findByIdAndDelete(task_id, (err, doc) => {
		if (err) {
			return res.status(500);
		} else {
			return res.status(200).json(doc);
		}
	})
})

// Join a Task
router.get('/join/:tid', (req, res) => {
	Task.findByIdAndUpdate({ _id: req.params.tid }, {
		$addToSet: { users: res.locals._id }
	}, (err, task) => {
		if (err) return res.status(500).send(err);
		if (!task) return res.status(404).json({
			ok: false,
			message: "no tasks found"
		})
		User.exists({ _id: res.locals._id, 'tasks.task': req.params.tid }, (err, exists) => {
			if (err) return res.status(500).json({
				ok: false,
				message: "Internal Server Error"
			})
			if (exists) return res.status(409).json({
				ok: false,
				message: "You have already joined this Donought"
			})
			User.findByIdAndUpdate(
				res.locals._id,
				{
					$addToSet: { tasks: { task: req.params.tid, comment: "hello" } }
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
router.post('/log', (req, res) => {
	const serverErrMsg = {
		ok: false,
		message: "Internal Server Error!"
	}
	let consecutive = false;
	Log.findOne({
		user: res.locals._id,
		task: req.body.tid
	})
		.sort({ createdAt: -1 })
		.exec((err, log) => {
			if (err) return res.status(500).json(serverErrMsg);
			if (log) {
				const startOfDay = moment().startOf('day');
				const createdAt = moment(log.createdAt);
				// Check if already logged today
				if (createdAt.isAfter(startOfDay)) return res.status(409).json({
					ok: false,
					message: "You have already submitted a log for this task today"
				})
				// Check if consecutive successes
				if (startOfDay.subtract(1, 'days').isAfter(createdAt) && log.success && req.body.success) consecutive = true;
			}

			// Create a log 
			const newLog = new Log({
				success: req.body.success,
				comment: req.body.comment,
				task: req.body.tid,
				user: res.locals._id
			});

			// Save Log
			newLog.save((err, prod) => {
				if (err) return res.status(500).json(serverErrMsg)
				if (prod._id) {
					const logID = prod._id
					let update;
					if (consecutive) {
						update = {

							$addToSet: { 'tasks.$.logs': logID },
							$inc: { 'tasks.$.consecutive': 1 }
						}
					} else {
						console.log("Not")
						update = {
							$addToSet: { 'tasks.$.logs': logID }
						}
					}
					console.log(update)
					User.findOneAndUpdate({
						_id: res.locals._id,
						tasks: { $elemMatch: { task: req.body.tid } }
					}, update, (err, doc) => {
						if (err) return res.status(500).json(serverErrMsg)
						res.status(200).json({
							ok: true,
							message: "Successfully added log"
						})
					})
				}

			})
		})
})


module.exports = router