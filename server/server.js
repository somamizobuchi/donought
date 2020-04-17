const express = require('express');
const app = express();
const mongoose = require('mongoose');
const apiRouter = require('./routes/api');
const cors = require('cors');



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
        console.log(`Server started on port: ${port}`);
    }else{
        console.log(err);
    }
})

// Middlewares and Routers
app.use(cors());
app.use('/api', apiRouter);
