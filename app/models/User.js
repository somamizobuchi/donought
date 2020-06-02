const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;


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
		}]
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
userSchema.statics.compareHash = async (password, hash) => {
	let same;
	try {
		same = await bcrypt.compare(password, hash);
	} catch (err) {
		throw new Error(err)
	}
	return same
}

// Export model
module.exports = mongoose.model('User', userSchema)