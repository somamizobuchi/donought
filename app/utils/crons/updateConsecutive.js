const cronJob = require('cron').CronJob;
const User = require('../../models/User');
const moment = require('moment-timezone');

module.exports = new cronJob('0 0 * * *', () => {
	console.log("Updating 'consecutive' field for each user");
	var startOfYesterday = moment().tz('America/New_York').subtract(1, 'days').startOf('day').toISOString();
	var endOfYesterday = moment().tz('America/New_York').subtract(1, 'days').endOf('day').toISOString();
	User
		.find({
			timezone: 'America/New_York'
		})
		.select('tasks._id tasks.logs tasks.streak tasks.isLogged')
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
					// No log was posted yesterday...
					if (task.logs.length < 1) {
						task.streak = 0;
					}
					// Reset isLogged to false
					task.isLogged = false;
				})
				// Save users
				user.save(err => {
					if (err) console.log(err);
				})
			});
			console.log("Cron job complete!");
		})
},
	null, 	// on complete
	true,		// start?
	'America/New_York'			// timezone
);
