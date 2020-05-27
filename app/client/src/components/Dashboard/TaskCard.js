import React, { useState } from 'react'
import { Alert, Card, CardBody, CardText, CardHeader, Button } from 'reactstrap'

export default function TaskCard(props) {

	const [alert, setAlert] = useState({
		isOpen: false,
		color: "",
		message: ""
	});
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
				// Refresh
				props.setRefresh(!props.refresh);
			})
	}

	// handle new log 
	const handleJoin = (e) => {
		e.preventDefault();
		// Set header options for a new log
		fetch(`/api/task/join/${props.tid}`)
			.then(res => res.json())
			.then(json => {
				if (json.ok) {
					console.log(json)
					props.setRefresh(true);
					setAlert({
						...alert,
						isOpen: true,
						color: "success",
						message: "Successfully joined!"
					});
				} else {
					setAlert({
						...alert,
						isOpen: true,
						color: "danger",
						message: "Sorry, something went wrong!"
					});
					setAlert(true);
				}
			})
			.catch(err => console.log(err));
	}

	// Render
	return (
		<Card>
			<CardHeader><h2>{props.title}</h2></CardHeader>
			<CardBody>
				<Alert isOpen={alert.isOpen} color={alert.color}>{alert.message}</Alert>
				<CardText>{props.desc}</CardText>
				<CardText>{props.cat}</CardText>
				<CardText>{props.tid}</CardText>
				<Button onClick={handleDelete} color="danger">Delete</Button>
				<Button onClick={handleJoin} color="success">Join</Button>
			</CardBody>
		</Card>
	)
}
