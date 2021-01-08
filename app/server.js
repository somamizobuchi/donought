const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const chalk = require('chalk');
const consecutiveCron = require('./utils/crons/updateConsecutive');
const apiRouter = require('./api/index');

// Environment Variables 
require('dotenv').config();

// Production environment
// Database connection
var mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}
mongoose.connect(process.env.MONGO_URI, mongooseOptions)
    .then(() => {
        console.log(chalk.green("Connected to database"));
    })
    .catch(err => {
        console.log(chalk.red(err));
    })

// Cron Jobs
consecutiveCron.start();

// Open server on port
const port = process.env.PORT || 5000;
app.listen(port, (err) => {
    if (!err) {
        console.log("Server started on port: " + chalk.blue(port));
    } else {
        console.log(err);
    }
})

// Middlewares and Routers
app.use(cors());    // Cross-Origin API calls (React -> :5000)
app.use('/api', apiRouter); // Rest API methods

// Production build: static page
if (process.env.NODE_ENV === 'production') {
    console.log("Production Environment")
    const path = require('path');
    app.use(express.static('client/dist')); // serve the static react app
    app.get(/^\/(?!api).*/, (req, res) => { // don't serve api routes to react app
        res.sendFile(path.join(__dirname, './client/dist/index.html'));
    });
}