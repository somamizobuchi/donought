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



// Get all tasks associated wiht user 
router.get('/:uid', (req, res) => {
	// 
	User.findById(req.params.uid)
		.select('tasks')
		.exec((err, doc) => {
			if (err) res.status(500).json({ Error: "Database Queary Error" })
			res.status(200).json(doc);
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

// Get from UserID and TaskID
router.get('/:uid/:tid', (req, res) => {
	if (req.params.uid != res.locals._id) {
		res.status(403).json({
			Error: "Unauthorized"
		})
	}
	User.find({
		tasks: {
			_id: req.params.tid
		}
	}, (err, doc) => {
		if (err) return res.status(500).json({
			ok: false,
			message: "Internal Server Error"
		})
		return res.status(200).json(doc)
	});
});


// Add a log
router.post('/log', (req, res) => {
	var now = moment().startOf('day');
	var serverErrMsg = {
		ok: false,
		message: "Internal Server Error"
	}
	Log.exists({
		user: res.locals._id,
		task: req.body.tid,
		createdAt: { $gt: now }
	}, (err, exists) => {
		// Error
		if (err) return res.status(500).json(serverErrMsg)
		// Doc exists
		if (exists) return res.status(409).json({
			ok: false,
			message: "A log has already been submitted for this task"
		})
		// Create a log 
		const log = new Log({
			success: req.body.success,
			comment: req.body.comment,
			task: req.body.tid,
			user: res.locals._id
		});
		// Save Log
		log.save((err, prod) => {
			if (err) return res.status(500).json(serverErrMsg)
			User.findOne({
				_id: res.locals._id,
				tasks: { $elemMatch: { task: req.body.tid } }
			}, (err, doc) => {
				if (err) return res.status(500).json(serverErrMsg)
				res.status(200).json(doc)
			})
		})
	})
})

module.exports = router