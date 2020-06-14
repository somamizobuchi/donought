import React, { useState } from 'react'
import moment from 'moment'
import {
	Modal,
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
	Progress,
	ModalHeader,
	ModalBody,
	ButtonGroup,
	Col
} from 'reactstrap'

export default function TaskCard(props) {

	const [alert, setAlert] = useState({
		isOpen: false,
		color: "",
		message: ""
	});

	const [modal, setModal] = useState(false)

	const {
		task,
		logs,
		logged
	} = props

	// Progress Bar logic
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
		if (!flag) items.push(<Progress striped bar value={val} color="light" />)
	}

	// Form modal
	const toggleLogModal = (e) => {
		e.preventDefault()
		setModal(true)
	}

	// Log Button
	const logButton = (logged) ?
		(<Button disabled className="float-right">Log</Button>) :
		(<Button onClick={toggleLogModal} className="float-right" color="success">Log</Button>);

	// Consecutive (streak) badge
	const consecutiveBadge = (props.consecutive > 0) ?
		(<Badge color="warning" pill>&#x1F525; {props.consecutive}</Badge>) :
		null;

	// Render
	return (
		<Card>
			<CardHeader>{task.title} {consecutiveBadge} {logButton} </CardHeader>
			<CardBody>
				<Alert isOpen={alert.isOpen} color={alert.color}>{alert.message}</Alert>
				<CardText><Badge pill>{task.category}</Badge></CardText>
				<CardText>{task.description}</CardText>
				<LogFormModal tid={task._id} alert={{ alert, setAlert }} modal={modal} setModal={setModal} />
				Last 10:
				<Progress multi className="border">
					{items}
				</Progress>
				<Col className="text-center mt-3">
				</Col>
			</CardBody>
		</Card>
	)
}

// Form Modal
const LogFormModal = (props) => {
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
				props.setModal(false)
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

	const toggleModal = () => {
		props.setModal(!props.modal)
	}

	return (
		<Modal isOpen={props.modal} toggle={toggleModal}>
			<ModalHeader toggle={toggleModal}>Success?</ModalHeader>
			<ModalBody>
				<Form>
					<FormGroup>
						<ButtonGroup block>
							<Button onClick={() => setForm({ ...form, success: true })} active={form.success === true} color="success">Yes</Button>
							<Button onClick={() => setForm({ ...form, success: false })} active={form.success === false} color="secondary">No</Button>
						</ButtonGroup>
					</FormGroup>
					<FormGroup>
						<Label for="comment">Comment</Label>
						<Input name="comment" type="text" value={form.comment} onChange={updateForm} />
					</FormGroup>
					<Button onClick={handleLog} color="primary">Submit</Button>
				</Form>
			</ModalBody>
		</Modal>
	)
}
