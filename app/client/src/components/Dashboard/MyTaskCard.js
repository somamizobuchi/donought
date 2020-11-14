import React, { useState, useEffect } from 'react'
import spacetime from 'spacetime'
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
	CardFooter,
	Button,
	ModalHeader,
	ModalBody,
	ButtonGroup,
	ButtonDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Row,
	Col,
	Container,
	Tooltip
} from 'reactstrap'
import { BsCheck, BsX } from 'react-icons/bs';

export default function TaskCard(props) {

	// States
	const [alert, setAlert] = useState({
		isOpen: false,
		color: "",
		message: ""
	});

	const [modal, setModal] = useState(false)

	// Props
	const {
		task,
		logs,
		logged
	} = props

	const {
		refresh,
		setRefresh
	} = props.refresh;

	// testing new progress
	const Streak = (props) => {
		const {
			color,
			target,
			today,
			date
		} = props;
		const [tooltipOpen, setTooltipOpen] = useState(false);
		const toggleTooltip = () => setTooltipOpen(!tooltipOpen);
		const style = {
			borderRadius: "10px",
			border: today ? "2px solid #888" : "1px solid #888",
			width: "20px",
			height: "20px",
			padding: 0
		}
		return (
			<div className="col row">
				<div id={target} className={"bg-" + color} style={style}></div>
				<Tooltip
					isOpen={tooltipOpen}
					toggle={toggleTooltip}
					target={target}
					placement="top"
				>
					{date}
				</Tooltip>
			</div>
		)
	}

	const [streaks, setStreaks] = useState([]);

	// Use Effect Hook
	useEffect(() => {
		var items = []
		var i;
		let s = spacetime.now('America/New_York');

		for (i = 9; i >= 0; i--) {
			let day = s.clone().subtract(i, 'days')
			let date = i === 0 ? "Today" : day.clone().format('{day-short}, {month-short} {date-ordinal}');
			let flag = logs.some(log => {
				let logDate = spacetime(log.createdAt);
				if (logDate.isBetween(day.startOf('day'), day.endOf('day'))) {
					let color = log.success ? "success" : "danger"
					items.push(<Streak key={i} color={color} today={i === 0} date={date} target={task.title.replace(/ /g, '') + i} />)
					return true
				} else {
					// console.log("False");
					return false
				}
			})
			if (!flag) items.push(<Streak key={i} color="light" today={i === 0} date={date} target={task.title.replace(/ /g, '') + i} />)
		}
		setStreaks(items)
	}, [])

	// Form modal
	const toggleLogModal = (e) => {
		e.preventDefault()
		setModal(true)
	}

	// Log Button
	const logButton = (logged) ?
		(<Button color="primary" disabled block>Log</Button>) :
		(<Button onClick={toggleLogModal} color="primary" block>Log</Button>);

	// Consecutive (streak) badge
	const consecutiveBadge = (props.consecutive > 0) ?
		(<Badge color="warning" pill>&#x1F525; {props.consecutive}</Badge>) :
		null;

	// Render
	return (
		<Card>
			<CardHeader>
				<Row>
					<Col xs="8" className="align-self-center">
						<span className="font-weight-bold">{task.title} {consecutiveBadge}</span>
					</Col>
					<Col className="text-right">
						<TaskMenu tid={task._id} refresh={{ refresh, setRefresh }} />
					</Col>
				</Row>
			</CardHeader>
			<CardBody>
				<Alert isOpen={alert.isOpen} color={alert.color}>{alert.message}</Alert>
				<CardText><Badge pill>{task.category}</Badge></CardText>
				<CardText>{task.description}</CardText>
				<LogFormModal refresh={{ refresh, setRefresh }} tid={task._id} alert={{ alert, setAlert }} modal={modal} setModal={setModal} />
				{/* Streak */}
				<Container>
					<div className="row">
						{streaks}
					</div>
				</Container>
			</CardBody>
			<CardFooter>
				{logButton}
			</CardFooter>
		</Card>
	)
}

// Form Modal
const LogFormModal = (props) => {
	// Form State
	const [form, setForm] = useState({
		tid: props.tid,
		comment: '',
		success: null
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
				props.refresh.setRefresh(!props.refresh.refresh);
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

	// Render Modal
	return (
		<Modal isOpen={props.modal} toggle={toggleModal}>
			<ModalHeader toggle={toggleModal}>Success?</ModalHeader>
			<ModalBody>
				<Form>
					<FormGroup>
						<ButtonGroup className="w-100">
							<Button onClick={() => setForm({ ...form, success: true })} active={form.success} color={form.success ? "success" : "secondary"}><BsCheck /></Button>
							<Button onClick={() => setForm({ ...form, success: false })} active={form.success === false} color="secondary"><BsX /></Button>
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

const TaskMenu = (props) => {

	const [isOpen, setIsOpen] = useState(false)
	const toggle = () => {
		setIsOpen(!isOpen)
	}
	const handleDelete = (e) => {
		e.preventDefault();
		const requestOptions = {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				tid: props.tid
			})
		};
		fetch('/api/user/task', requestOptions)
			.then(res => res.json())
			.then(json => {
				props.refresh.setRefresh(!props.refresh.refresh)
			})
	}
	return (
		<ButtonDropdown isOpen={isOpen} direction="left" toggle={toggle}>
			<DropdownToggle
				tag="span"
				data-toggle="dropdown"
				aria-expanded={isOpen}
			>
				<span className="font-weight-bold btn btn-light">&#8942;</span>
			</DropdownToggle>
			<DropdownMenu>
				<DropdownItem header>Action</DropdownItem>
				<DropdownItem className="text-danger" onClick={handleDelete}>Delete</DropdownItem>
			</DropdownMenu>
		</ButtonDropdown>
	)
}