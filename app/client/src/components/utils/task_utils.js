export const log_task = (form_data = { tid: String, success: Boolean, comment: String }, cb) => {

	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'Application/JSON'
		},
		body: JSON.stringify(form_data)
	}

	fetch('/api/task/log', requestOptions)
		.then(res => res.json())
		.then(res => {
			if (res.ok) {
				return cb(null, true);
			} else {
				return cb(
					res.message,
					null
				)
			}
		})
		.catch(err => {
			cb(err.message, null);
		})
}