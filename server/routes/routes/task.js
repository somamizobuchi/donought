const router = require('express').Router()
const auth = require('./auth');
router.use('*', auth)
const User = require('../../models/User');

router.get('/:uid', (req, res) => {
    
    User.findById(req.params.uid)
        .select('tasks')
        .exec((err, doc) => {
            if(err) res.status(500).json({Error: "Database Queary Error"})
            res.status(200).json(doc);
        })
})

// New
router.post('/new', (req, res) => {
    var filter = {_id: res.locals._id}
    var update = {$push: {tasks: {
        title: req.body.title,
        description: req.body.description,
        start_date: req.body.start_date,
        end_date: req.body.end_date
    }}}
    User.findOneAndUpdate(filter, update,(err, user) => {
        if(err){
            return res.send(500).json({
                Error: "Query Error"
            })
        }
        if(!user){
            return res.send(403).json({
                Error: "Forbidden"
            })
        }
        return res.status(200).json({
            success: true
        })
    })

})

// Delete
router.delete('/delete', (req, res) => {
    var filter = {
        _id: res.locals._id
    }
    var update = {
        "$pull": {"tasks": {"_id": req.body.id}}
    }
    User.updateOne(filter, update, (err, doc) => {
        if(err) return res.status(500).send(err)
        return res.status(200).json({
            success: true
        })
    })
})

// Get
router.get('/:uid/:tid', (req, res) => {
    if(req.params.uid != res.locals._id){
        res.status(403).json({
            Error: "Unauthorized" 
        })
    }
    var query = {
        'id': res.locals.id
    }
    User.findOne(query)
        .select({tasks: {'$elemMatch': {_id: req.params.id}}})
        .exec((err, doc) => {
            return res.status(200).json(doc.tasks[0])
        })
})

// Add a log
router.post('/log', (req, res) => {
    const query = {
        "_id": res.locals._id,
        "tasks": {$elemMatch: {
            "_id": req.body._id}
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
        if(err) return res.status(500).send(err)
        return res.status(200).json(doc)
    })
})

module.exports = router