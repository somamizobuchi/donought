import React, { useState } from 'react'
import moment from 'moment'
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
	Button,
	Progress
} from 'reactstrap'

export default function TaskCard(props) {

	const [alert, setAlert] = useState({
		isOpen: false,
		color: "",
		message: ""
	});

	const task = props.task
	const logs = props.logs
	const logged = props.logged

	const items = [];
	const val = 100 / 10;
	var i;
	const today = moment();
	for (i = 9; i >= 0; i--) {
		let day = today.clone()
		day.subtract(i, 'days')
		let flag = logs.some(log => {
			if (day.isSame(log.createdAt, 'day')) {
				let color = log.success ? "primary" : "secondary"
				let text = (i === 0) ? "Today" : "";
				items.push(<Progress bar value={val} color={color} >{text}</Progress>)
				return true
			} else {
				return false
			}
		})
		if (!flag) items.push(<Progress bar value={val} color="light" />)
	}

	// Render
	return (
		<Card>
			<CardHeader><h2>{task.title}</h2></CardHeader>
			<CardBody>
				<Alert isOpen={alert.isOpen} color={alert.color}>{alert.message}</Alert>
				<CardText><Badge pill>{task.description}</Badge></CardText>
				<CardText>{task.category}</CardText>
				<LogForm logged={logged} tid={task._id} alert={{ alert, setAlert }} />
				<h3><Badge color="warning" pill>&#x1F525; {props.consecutive}</Badge></h3>
				Last 10:
				<Progress multi>
					{items}
				</Progress>
			</CardBody>
		</Card>
	)
}

const LogForm = (props) => {
	// Form State
	const [form, setForm] = useState({
		tid: props.tid,
		comment: '',
		success: false
	})
	// Update Form
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
				if (json.ok) { // No errors
					props.alert.setAlert({
						...alert,
						isOpen: true,
						color: "success",
						message: json.message
					})
				} else {		// Server Side errors
					props.alert.setAlert({
						...alert,
						isOpen: true,
						color: "danger",
						message: json.message
					})
				}
			})
			.catch(err => { // Client side error
				props.alert.setAlert({
					...alert,
					isOpen: true,
					color: "danger",
					message: "Something went wrong!"
				})
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
				<FormGroup tag="fieldset">
					<legend>Did you?</legend>
					<FormGroup check>
						<Label check>
							<Input type="radio" name="success" onChange={updateForm} value={false} />
							Yes
          </Label>
					</FormGroup>
					<FormGroup check>
						<Label check>
							<Input type="radio" name="success" onChange={updateForm} value={true} />
							No
          	</Label>
					</FormGroup>
				</FormGroup>
				<Button onClick={handleLog} color="primary">Submit</Button>
			</Form>
		)
	}
}
