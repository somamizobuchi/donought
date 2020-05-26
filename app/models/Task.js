const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Tasks Schema
TaskSchema = new Schema({
	title: String,
	description: String,
	category: String,
	users: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}]
}, {
	timestamps: true
});

module.exports = mongoose.model('Task', TaskSchema);
