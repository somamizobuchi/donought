const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new Schema({
	type: {
		type: String,
	},
	s3_key: {
		type: String
	},
	path: {
		type: String
	}
}, {
	timestamps: true
})

module.exports = mongoose.model('File', FileSchema);