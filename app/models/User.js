const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	firstname: String,
	lastname: String,
	email: String,
	password: String,
	tasks: [{
		task_id: Schema.Types.ObjectID,
		ref: 'Task'
	}],
	logs: [{
		log_id: Schema.Types.ObjectID,
		ref: 'Log'
	}]
}, {
	timestamps: true
});

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

userSchema.statics.compareHash = async (password, hash) => {
	let same;
	try {
		same = await bcrypt.compare(password, hash);
	} catch (err) {
		throw new Error(err)
	}
	return same

}

module.exports = mongoose.model('User', userSchema)