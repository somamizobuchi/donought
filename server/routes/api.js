const express = require('express');
const router = express.Router();
const userRoute = require('./routes/user');
const tunaRoute = require('./routes/task');
const cookieParser = require('cookie-parser')
require('dotenv').config();

router.use('*', cookieParser());
router.use('*', express.json())
router.use('/user', userRoute);
router.use('/task', tunaRoute);


module.exports = router;