import React, { useState, useEffect } from 'react'
import { Col, Card, CardTitle, CardText, Button } from 'reactstrap'

export default function Task(props) {
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
				console.log(res);
				// Refresh
				props.setRefresh(true);
			})
	}

	// handle new log 
	const handleLog = (e) => {
		e.preventDefault();
		// Set header options for a new log
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				tid: props.tid,
				success: true,
				comment: "blah"
			})
		}
		fetch('/api/task/log', requestOptions)
			.then(res => res.json())
			.then(json => {
				console.log(json);
			})
			.catch(err => console.log(err.message));
	}
	// Render
	return (
		<Col sm="12" lg="4">
			<Card body>
				<CardTitle>{props.title}</CardTitle>
				<CardText>{props.desc}</CardText>
				<CardText>{props.cat}</CardText>
				<CardText>{props.tid}</CardText>
				<Button onClick={handleDelete} color="danger">Delete</Button>
				<Button onClick={handleLog} color="success">Log</Button>
			</Card>
		</Col>
	)
}
