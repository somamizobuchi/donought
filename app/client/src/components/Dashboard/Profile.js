import React, { useContext } from 'react'
import { UserContext } from '../../UserContext'
import { delete_user } from '../../utils/user_utils'

export default function Profile(props) {

	var { user, setUser } = useContext(UserContext);

	const handleDelete = (e) => {
		e.preventDefault();
		delete_user((err, res) => {
			if (err) {
				console.log(err.message)
			} else {
				if (res.ok) {
					setUser({
						...user,
						authorized: false
					})
				}
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