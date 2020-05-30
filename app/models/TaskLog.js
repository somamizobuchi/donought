const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Task Log Schema
TaskLogSchema = Schema({
    comment: String,
    success: Boolean,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    task: { type: Schema.Types.ObjectId, ref: 'Task' }
}, {
    timestamps: true
})

// Export Model
module.exports = mongoose.model('Log', TaskLogSchema);