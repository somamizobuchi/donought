import React, { useState } from 'react'
import {
	Badge,
	Alert,
	Card,
	CardBody,
	CardText,
	CardHeader,
	Button
} from 'reactstrap'

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
					setAlert({
						...alert,
						isOpen: true,
						color: "success",
						message: json.message
					});
				} else {
					setAlert({
						isOpen: true,
						color: "danger",
						message: json.message
					});
				}
			})
			.catch(err => console.log(err));
	}

	// Render
	return (
		<Card>
			<CardHeader>{props.title} <Badge pill>&#x1F464; {props.numUsers}</Badge></CardHeader>
			<CardBody>
				<Alert isOpen={alert.isOpen} color={alert.color}>{alert.message}</Alert>
				<CardText><Badge pill>{props.cat}</Badge></CardText>
				<CardText>{props.desc}</CardText>
				<Button onClick={handleDelete} color="danger">Delete</Button>
				<Button onClick={handleJoin} color="success">Join</Button>
			</CardBody>
		</Card>
	)
}
