const cronJob = require('cron').CronJob;
const User = require('../../models/User');
const moment = require('moment');

const updateConsecutive = (tz) => {
	var task = new cronJob('15 14 * * *', () => {
		console.log("Updating 'consecutive' field for each user");
		var startOfYesterday = moment().subtract(1, 'days').startOf('day').toISOString();
		var endOfYesterday = moment().subtract(1, 'days').endOf('day').toISOString();
		User
			.find({
				timezone: tz
			})
			.select('tasks._id tasks.logs tasks.consecutive')
			.populate({
				path: 'tasks.logs',
				match: {
					$and: [
						{ createdAt: { $gte: startOfYesterday } },
						{ createdAt: { $lte: endOfYesterday } }
					]
				},
				select: [
					'createdAt'
				]
			})
			.exec((err, docs) => {
				if (err) console.log(err)
				docs.forEach(user => {
					user.tasks.forEach(task => {
						if (task.logs.length < 1) {
							User.findOneAndUpdate({
								_id: user._id,
								'tasks._id': task._id
							}, {
								$set: { 'tasks.$.consecutive': 0 }
							}, (err, doc) => {
								if (err) console.log(err);
							})
						};
					})
				});
			})
	},
		null, 	// on complete
		true,		// start?
		tz			// timezon
	);
	// start the task
	task.start()
}

module.exports = updateConsecutive