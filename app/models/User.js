const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema 
const userSchema = new Schema({
	firstname: {
		type: String,
		required: true
	},
	lastname: {
		type: String,
		required: true
	},
	googleId: {
		type: String,
		required: true
	},
	email: String,
	picture: {
		type: String,
		default: ''
	},
	_role: {
		type: Number,
		enum: [
			0, // user
			1	 // admin
		],
		default: 0
	},
	tasks: [{
		task: {
			type: Schema.Types.ObjectID,
			ref: 'Task'
		},
		streak: {
			type: Number,
			default: 0
		},
		logs: [{
			type: Schema.Types.ObjectId,
			ref: 'Log'
		}],
		isLogged: {
			type: Boolean,
			default: false
		}
	}],
	timezone: String,
}, {
	timestamps: true
});

// Export model
module.exports = mongoose.model('User', userSchema)