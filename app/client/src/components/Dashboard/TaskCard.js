import React, { useState } from 'react'
import { useUserContext } from '../../contexts/UserContext';

export default function TaskCard(props) {

	const { user, setUser } = useUserContext();

	// handling delete
	const handleDelete = (e) => {
		e.preventDefault();
		// Set header options
		const requestOptions = {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				tid: props.tid
			})
		};
		fetch('/api/task/delete/', requestOptions)
			.then(res => res.json())
			.then(res => {
				props.setRefresh(!props.refresh);
			})
	}

	// handle new join 
	const handleJoin = (e) => {
		e.preventDefault();
		// Set header options for a new log
		fetch(`/api/task/join/${props.tid}`)
			.then(res => res.json())
			.then(json => {
				if (json.ok) {
					props.setRefresh(true);

				} else {
					;
				}
			})
			.catch(err => console.log(err));
	}

	// Render
	return (
		<div className="col-sm-8 col-md-5 col-lg-4">
			<div className="card">
				<div className="card-header">{props.title} <div className="badge badge-pill">&#x1F464; {props.numUsers}</div></div>
				<div className="card-body">
					<div className="card-text"><div className="badge badge-pill">{props.cat}</div></div>
					<div className="card-text">{props.desc}</div>
					<button className="btn btn-danger" onClick={handleDelete}>Delete</button>
					<button className="btn btn-success" onClick={handleJoin}>Join</button>
				</div>
			</div>
		</div>
	)
}
