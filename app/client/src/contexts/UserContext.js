import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom';

const UserContext = React.createContext();

export default function UserProvider({ children }) {
	// User State to be used in context
	const [currentUser, setCurrentUser] = useState({
		_id: null,
		firstname: null,
		lastname: null,
		picture: null,
		authorized: false
	});
	// Loading state: while fetching
	const [loading, setLoading] = useState(true);
	// UseHistory
	// Authorize User
	useEffect(() => {
		setLoading(true);
		fetch('/api/auth/')
			.then(res => {
				if (!res.ok) throw { code: res.status };
				return res.json();
			})
			.then(res => {
				setCurrentUser({
					_id: res.user._id,
					firstname: res.user.firstname,
					lastname: res.user.lastname,
					picture: res.user.picture,
					_role: res.user._role,
					authorized: true
				});
			})
			.catch(err => {
				console.log(err.code);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [])

	const signOut = () => {
		return new Promise(resolve => {
			fetch('/api/auth/signout')
				.then(res => {
					setCurrentUser({
						...currentUser,
						authorized: false,
					})
					resolve()
				})
		})
	}

	return (
		<UserContext.Provider value={{ currentUser, signOut }}>
			{!loading && children}
		</UserContext.Provider>
	)
}

export function useUserContext() {
	return useContext(UserContext);
}
