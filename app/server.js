const express = require('express');
const app = express();
const mongoose = require('mongoose');
const apiRouter = require('./routes/api');
const cors = require('cors');
const chalk = require('chalk');
// Environment Variables 
require('dotenv').config();

// Database connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, (err) => {
    if(!err){
        console.log("Connected to database")
    }else{
        console.log(err);
    }
})

// Open server on port
const port = process.env.PORT | 5000;
app.listen(port, (err) => {
    if(!err){
        console.log("Server started on port: " + chalk.blue(port));
    }else{
        console.log(err);
    }
})

// Middlewares and Routers
app.use(cors());    // Cross-Origin API calls (React -> :5000)
app.use('/api', apiRouter); // Rest API methods
