const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Task Log Schema
TaskLogSchema = Schema({
    comment: String,
    success: Boolean,
    user: { user_id: Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
})

// Export Model
module.exports = mongoose.model('Log', TaskLogSchema);