const router = require('express').Router();
const User = require('../../models/User');
const auth = require('./auth')

router.get('/add/', auth, (req, res) => {

})

module.exports = router;