const express = require('express');
const app = express();
const mongoose = require('mongoose');
const apiRouter = require('./routes/api');
const cors = require('cors');
const chalk = require('chalk');
const updateConsecutive = require('./utils/crons/updateConsecutive');
// Environment Variables 
require('dotenv').config();

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
updateConsecutive('America/New_York');

// Open server on port
const port = process.env.PORT | 5000;
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

