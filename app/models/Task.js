const mongoose = require('mongoose');
const log = require('./TaskLog');

module.exports = new mongoose.Schema({
    title: String,
    description: String,
    start_date: Date,
    end_date: Date, 
    logs: [log],
    active: Boolean
},{
    timestamps: true
})