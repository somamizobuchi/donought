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
export const logout = (cb) => {
	fetch('api/user/logout')
		.then(res => res.json())
		.then(res => {
			if (res.ok) {
				return cb(true);
			} else {
				return cb(false);
			}
		})
		.catch(err => {
			console.log(err);
			return cb(false);
		})
}