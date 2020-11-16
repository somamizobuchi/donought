import React, { useContext } from 'react'
import { UserContext } from '../../UserContext'

export default function Profile(props) {

	var { user, setUser } = useContext(UserContext);
	const handleDelete = (e) => {
		e.preventDefault();
		const requestOptions = {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				tid: props.tid
			})
		};
		fetch('/api/user/', requestOptions)
			.then(res => res.json())
			.then(json => {
				if (json.ok) {
					setUser({
						...user,
						authorized: false
					})
				}
			})
	}

	return (
		<>
			Name: {user.firstname + " " + user.lastname}<br></br>
			Email: {user.email}<br></br>
			<hr></hr>
			<button className="btn btn-danger" onClick={handleDelete}>Delete Account</button>
		</>
	)
}