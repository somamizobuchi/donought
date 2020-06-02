import React, { useState } from 'react'
import {
	Badge,
	Form,
	FormGroup,
	Label,
	Input,
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


	// Render
	return (
		<Card>
			<CardHeader><h2>{props.title}</h2></CardHeader>
			<CardBody>
				<Alert isOpen={alert.isOpen} color={alert.color}>{alert.message}</Alert>
				<CardText><Badge pill>{props.description}</Badge></CardText>
				<CardText>{props.category}</CardText>
				<LogForm logged={props.logged} tid={props.tid} alert={{ alert, setAlert }} />
			</CardBody>
		</Card>
	)
}

const LogForm = (props) => {
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

	// Handle Logging
	const handleLog = (e) => {
		// prevent default behavior
		e.preventDefault();

		// Form input state
		setForm({
			...form,
			success: e.target.value
		})

		// Request Options
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(form)
		};

		// Make http request
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

	if (props.logged) {
		return <></>
	} else {
		return (
			<Form>
				<FormGroup>
					<Label for="comment">Comment</Label>
					<Input name="comment" type="text" value={form.comment} onChange={updateForm} />
				</FormGroup>
				<Button onClick={handleLog} value={true} color="success">Did</Button>
				<Button onClick={handleLog} value={false} color="danger">Didn't</Button>
			</Form>
		)
	}
}