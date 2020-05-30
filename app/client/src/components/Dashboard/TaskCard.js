import React, { useState } from 'react'
import { Form, FormGroup, Label, Input, Alert, Card, CardBody, CardText, CardHeader, Button } from 'reactstrap'

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
			<CardHeader><h2>{props.title}</h2></CardHeader>
			<CardBody>
				<Alert isOpen={alert.isOpen} color={alert.color}>{alert.message}</Alert>
				<CardText>{props.desc}</CardText>
				<CardText>{props.numUsers}</CardText>
				<CardText>{props.cat}</CardText>
				<CardText>{props.tid}</CardText>
				<CardButtons my={props.my} tid={props.tid} handleDelete={handleDelete} handleJoin={handleJoin} alert={{ alert, setAlert }} />
			</CardBody>
		</Card>
	)
}

const CardButtons = (props) => {

	const [form, setForm] = useState({
		tid: props.tid,
		comment: '',
		success: false
	})

	const updateForm = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value
		})
	}
	// Handle Log
	const handleLog = (e) => {
		e.preventDefault();
		setForm({
			...form,
			success: e.target.value
		})
		// Make http request
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(form)
		};

		fetch('/api/task/log', requestOptions)
			.then(res => res.json())
			.then(json => {
				if (json.ok) {
					props.alert.setAlert({
						...alert,
						isOpen: true,
						color: "success",
						message: json.message
					})
				} else {
					props.alert.setAlert({
						...alert,
						isOpen: true,
						color: "danger",
						message: json.message
					})
				}
			})
			.catch(err => {
				console.log(err)
			})
	}

	if (props.my === true) {
		return (
			<>
				<Form>
					<FormGroup>
						<Label for="comment">Comment</Label>
						<Input name="comment" type="text" value={form.comment} onChange={updateForm} />
					</FormGroup>
					<Button onClick={handleLog} value={true} color="success">Did</Button>
					<Button onClick={handleLog} value={false} color="danger">Didn't</Button>
				</Form>
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