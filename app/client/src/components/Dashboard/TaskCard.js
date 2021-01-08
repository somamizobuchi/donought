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
		<li className="task-item bg-ui-dark">
			<div className="task-title">{props.title}</div>
			<span>&#x1F464; {props.numUsers}</span>
			<div className="btn bg-primary" onClick={handleJoin}>Join</div>
		</li>
	)
}
