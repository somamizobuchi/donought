const log_task = (params = { tid: String, success: Boolean, comment: String }) => {
	return new Promise((resolve, reject) => {
		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'Application/JSON'
			},
			body: JSON.stringify(params)
		}
		fetch('/api/task/log', requestOptions)
			.then(res => {
				if (res.ok) {
					resolve()
				}
				if (res.status == 409) {
					reject(err = {
						status: res.status,
						message: "Conflict"
					})
				} else {
					reject(err = {
						status: res.status,
						message: "Failed to create log"
					})
				}
			})
			.catch(err => {
				reject(err = {
					status: 500,
					message: err.message
				})
			})
	})
}
module.exports = {
	log_task
}