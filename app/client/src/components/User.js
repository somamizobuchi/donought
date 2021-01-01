import React, { useEffect, useState } from 'react'
import { useUserContext } from '../contexts/UserContext'
import { useParams, useHistory } from "react-router-dom"
import UploadForm from './Dashboard/UploadForm'

export default function User() {

	const history = useHistory();

	const { id } = useParams();

	const [profile, setProfile] = useState({});

	const { user, setUser } = useUserContext();

	const handleFollow = (e) => {
		e.preventDefault();
		fetch(`${window.location.origin.toString()}/api/user/follow`, {
			method: 'POST',
			headers: { 'Content-Type': 'Application/JSON' },
			body: JSON.stringify({
				_id: id
			})
		})
			.then(res => {
				if (res.status === 200) {
					console.log("friend added");
					return;
				} else if (res.status === 409) {
					console.log("friend already added")
					return;
				}
				return;
			})
			.catch(err => {
				console.log(err.message);
				return;
			})
		return;
	}

	useEffect(() => {
		fetch(`/api/user/${id}`, { method: 'GET' })
			.then(res => {
				if (res.status == 200) {
					res.json()
						.then(doc => {
							setProfile(doc.user);
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
	}, [id])

	return (
		<>
			<h1>{profile.firstname}</h1>
			{user._id === id ? (<><UploadForm /></>) : (<button className="btn" onClick={handleFollow}>Follow</button>)}
		</>
	)
}
