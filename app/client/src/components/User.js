import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from "react-router-dom"

const User = (props) => {

	const history = useHistory();

	const { id } = useParams();

	const [user, setUser] = useState({});

	useEffect(() => {
		fetch(`/api/user/${id}`, { method: 'GET' })
			.then(res => {
				if (res.status == 200) {
					res.json()
						.then(doc => {
							setUser(doc.user);
						})
				}
				if (res.status == 404) {
					history.replace('/404')
					return;
				}
				if (res.status == 500) {
					history.replace('/404')
					return;
				}
			})
			.catch(err => {
				console.log(err.message);
			})
	}, [])

	return (
		<>
			<h1>User</h1>
			<h1>{user.firstname}</h1>
		</>
	)
}

export default User;