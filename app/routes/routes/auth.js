const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    var token = req.cookies['auth'];
    jwt.verify(token, process.env.JWT_KEY, (err, doc) => {
        if (err) {
            return res.status(401).json(err)
        } else {
            res.locals._id = doc._id;
            res.locals.email = doc.email;
            res.locals._role = doc._role;
            return next();
        }
    })
}