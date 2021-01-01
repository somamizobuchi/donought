import React, { useState, useEffect, useContext } from 'react'

const UserContext = React.createContext();


export default function UserProvider({ children }) {
	// User State to be used in context
	const [user, setUser] = useState({
		_id: '',
		email: '',
		firstname: '',
		lastname: '',
		authorized: false,
		tasks: [],
		image: null
	});
	// Loading state: while fetching
	const [loading, setLoading] = useState(true);
	// Authorize User
	useEffect(() => {
		fetch('/api/user/isauth')
			.then(res => res.json())
			.then(json => {
				setUser({
					_id: json._id,
					email: json.email,
					firstname: json.firstname,
					lastname: json.lastname,
					timezone: json.timezone,
					authorized: json.ok,
					tasks: []
				})
			})
			.catch(err => {
				console.log(err.message)
			})
			.finally(setLoading(false));
	}, [])
	return (
		<UserContext.Provider value={{ user, setUser }}>
			{!loading && children}
		</UserContext.Provider>
	)
}

export function useUserContext() {
	return useContext(UserContext);
}

export function login(email, password) {
	return new Promise((resolve, reject) => {
		fetch('/api/user/login', requestOptions)
			.then(res => {
				if (res.status == 200) {
					return res.json();
				} else {
					throw {
						status: res.status
					}
				}
			})
			.then(json => {

			})
			.catch(err => {
				reject(err);
			})
	})
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