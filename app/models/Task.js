const mongoose = require('mongoose');
const log = require('./TaskLog');
module.exports = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    time_start: Date,
    logs: [log],
    active: Boolean
},{
    timestamps: true
})
