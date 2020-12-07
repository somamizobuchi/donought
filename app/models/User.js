const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const Task = require('./Task');


// User Schema 
const userSchema = new Schema({
	firstname: String,
	lastname: String,
	email: String,
	password: String,
	_role: Number,
	tasks: [{
		task: {
			type: Schema.Types.ObjectID,
			ref: 'Task'
		},
		consecutive: {
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
	following: [{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		accepted: {
			type: Boolean,
			default: false
		}
	}],
	followers: [{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		accepted: {
			type: Boolean,
			default: false
		}
	}]
}, {
	timestamps: true
});

// generateHash(password)
userSchema.statics.generateHash = async (password) => {
	const saltRounds = 10;
	let hash;
	try {
		hash = await bcrypt.hash(password, saltRounds)
	} catch (err) {
		throw new Error(err);
	}
	return hash
}

// compareHash(Password, Hash)
userSchema.statics.compareHash = (password, hash) => {
	bcrypt.compare(password, hash)
		.then(res => {
			console.log(match);
			return res;
		})
}

// Export model
module.exports = mongoose.model('User', userSchema)