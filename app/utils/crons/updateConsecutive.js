const cron = require('node-cron');
const User = require('../../models/User');

const updateConsecutive = () => {
	cron.schedule('*/10 * * * * *', () => {
		User
			.find()
	})
}

module.exports = updateConsecutive