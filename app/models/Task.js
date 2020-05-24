const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Tasks Schema
TaskSchema = new Schema({
	title: String,
	description: String,
	category: String,
}, {
	timestamps: true
});

module.exports = mongoose.model('Task', TaskSchema);
