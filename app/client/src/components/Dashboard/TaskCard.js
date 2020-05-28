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
				console.log(json.ok)
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
			<CardHeader><h2>{props.title}</h2></CardHeader>
			<CardBody>
				<Alert isOpen={alert.isOpen} color={alert.color}>{alert.message}</Alert>
				<CardText>{props.desc}</CardText>
				<CardText>{props.numUsers}</CardText>
				<CardText>{props.cat}</CardText>
				<CardText>{props.tid}</CardText>
				<CardButtons my={props.my} handleDelete={handleDelete} handleJoin={handleJoin} />
			</CardBody>
		</Card>
	)
}

const CardButtons = (props) => {
	if (props.my === true) {
		return (
			<>
				<Button >Log</Button>
			</>
		)
	} else {
		return (
			<>
				<Button onClick={props.handleDelete} color="danger">Delete</Button>
				<Button onClick={props.handleJoin} color="success">Join</Button>
			</>
		)
	}
}