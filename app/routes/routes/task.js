const router = require('express').Router()
const auth = require('./auth');
router.use('*', auth)
const User = require('../../models/User');

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

// New task
router.post('/new', (req, res) => {
	var filter = { _id: res.locals._id }
	var update = {
		$push: {
			tasks: {
				title: req.body.title,
				description: req.body.description,
				category: req.body.category,
			}
		}
	}
	User.findOneAndUpdate(filter, update, (err, user) => {
		if (err) {
			return res.send(500).json({
				Error: "Query Error"
			})
		}
		if (!user) {
			return res.send(403).json({
				Error: "Forbidden"
			})
		}
		return res.status(200).json({
			success: true
		})
	})

})

// Delete task
router.delete('/delete/:tid', (req, res) => {
	var filter = {
		_id: res.locals._id
	}
	var update = {
		"$pull": { "tasks": { "_id": req.params.tid } }
	}
	User.updateOne(filter, update, (err, doc) => {
		if (err) return res.status(500).send(err)
		return res.status(200).json({
			success: true
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
		if (!err) {
			return res.status(200).json(doc)
		} else {
			return err
		}
	});
});

// Get Logs

// Add a log
router.post('/log', (req, res) => {
	var d = new Date();
	console.log(d.toISOString());
	User.findOne(
		{
			'_id': res.locals._id,
			'tasks._id': req.body.tid,
		}
	).select(
		'tasks.logs'
	).sort(
		[['date', '-1']]
	).exec(
		(err, docs) => {
			if (err) console.log(err)
			else console.log(docs.tasks[0].logs)
		}
	)
	const query = {
		_id: res.locals._id,
		tasks: {
			$elemMatch: {
				_id: req.body.tid
			}
		}
	}
	const update = {
		$push: {
			"tasks.$.logs": {
				comment: req.body.comment,
				success: req.body.success
			}
		}
	}
	User.updateOne(query, update, (err, doc) => {
		if (err) return res.status(500).send(err)
		return res.status(200).json(doc)
	})
})

module.exports = router