require('dotenv').config();
const express = require('express');
const router = express.Router();
const userRoute = require('./routers/user');
const taskRoute = require('./routers/task');
const authRouter = require('./routers/auth/index')
const cookieParser = require('cookie-parser')

router.use('*', cookieParser());
router.use('*', express.json())
router.use('/user', userRoute);
router.use('/task', taskRoute);
router.use('/auth', authRouter);

module.exports = router;