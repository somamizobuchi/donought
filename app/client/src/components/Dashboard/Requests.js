import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Requests(props) {

	const [requests, setRequests] = useState([]);

	useEffect(() => {
		fetch('/api/user/requests', {
			method: 'GET'
		})
			.then(res => res.json())
			.then(doc => {
				setRequests(doc.doc.followers);
			})
			.catch(err => {
			})
	}, [])

	const handleAccept = (e, id) => {
		e.preventDefault();
		fetch('/api/user/accept', {
			method: 'POST',
			headers: { 'Content-Type': 'Application/JSON' },
			body: JSON.stringify({
				_id: id
			})
		})
			.then(res => {
				if (res.status === 200) {
					res.json()
						.then(res => console.log(res));
				}
			})
	}

	return (
		<>
			<div className="dropdown d-none d-lg-block">
				<a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					Requests
				</a>
				<div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
					{requests.map(r => (
						<div key={"req-" + r._id}>
							<Link to={'/user/' + r.user._id} className="dropdown-item">{r.user.firstname + ' ' + r.user.lastname}</Link>
							<button className="btn btn-primary" onClick={e => handleAccept(e, r.user._id)}>Accept</button>
						</div>
					))}
				</div>
			</div>
		</>
	)
}