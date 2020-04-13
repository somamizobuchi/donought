const router = require('express').Router()
const auth = require('./auth');
router.use('*', auth)
const User = require('../../models/User');

// New
router.post('/new', (req, res) => {
    var filter = {_id: res.locals._id}
    var update = {$push: {tunas: {
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
        "$pull": {"tunas": {"_id": req.body.id}}
    }
    User.updateOne(filter, update, (err, doc) => {
        if(err) return res.status(500).send(err)
        return res.status(200).json({
            success: true
        })
    })
})

// Get
router.get('/:id', (req, res) => {
    var query = {
        tunas: {$elemMatch: {_id: req.params.id}}
    }
    User.findById(res.locals._id, query, (err, doc) => {
        if(err) return res.status(500).json({Error: "Database query error"})
        if(!doc) return res.status(404).json({Error: "Tuna not found"})
        return res.status(200).json(doc)
    })
})

// Add a log
router.post('/log', (req, res) => {
    const query = {
        "_id": res.locals._id,
        "tunas": {$elemMatch: {
            "_id": req.body.id}
        }
    }
    const update = {
        $push: {
            "tunas.$.logs": {
                comment: req.body.comment
            }
        }
    }
    User.updateOne(query, update, (err, doc) => {
        if(err) return res.status(500).send(err)
        return res.status(200).json(doc)
    })
})

module.exports = router