const BASE_URL = window.location.origin.toString();
// Logout
export const logout = () => {
	return new Promise((resolve, reject) => {
		fetch(`${BASE_URL}/api/user/signout`)
			.then(res => {
				if (res.ok) {
					resolve(true)
				} else {
					reject(err = {
						status: res.status,
						message: "Failed to logout user"
					})
				}
			})
			.catch(err => {
				reject(err = {
					status: 500,
					message: "Internal Server Error!"
				});
			})
	})
}

export const delete_user = (cb) => {
	let err = null;
	let res = null;
	fetch('/api/user/', { method: 'DELETE' })
		.then(res => res.json())
		.then(json => {
			if (json.ok) {
				res = json;
			} else {
				err = json.message
			}
			cb(err, res);
		})
}