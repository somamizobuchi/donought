const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    comment: String,
    success: Boolean
},{
    timestamps: true
})