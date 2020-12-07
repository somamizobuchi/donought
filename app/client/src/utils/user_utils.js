//
const BASE_URL = window.location.origin.toString();
// User Login
export const login = (email, pass, cb) => {
	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			email: email,
			password: pass
		})
	};
	fetch('/api/user/login', requestOptions)
		.then(res => res.json())
		.then(json => {
			let err = null;
			if (json.ok) {
				let user = {
					_id: json._id,
					email: json.email,
					firstname: json.firstname,
					lastname: json.lastname,
					timezone: json.timezone,
					_role: json._role,
					authorized: true
				}
				return cb(err, user);
			} else {
				err = {
					message: json.message
				};
				return cb(err, null);
			}
		})
		.catch(err => {
			return cb(err, null);
		})
}

// Logout
export const logout = () => {
	return new Promise((resolve, reject) => {
		fetch(`${BASE_URL}/api/user/logout`)
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