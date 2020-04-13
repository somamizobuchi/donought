const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    var token = req.cookies['auth'];
    jwt.verify(token, process.env.JWT_KEY, (err, doc) => {
        if(err){
            return res.sendStatus(403)
        }else{
            res.locals._id = doc._id
            next()
        }
    })
}