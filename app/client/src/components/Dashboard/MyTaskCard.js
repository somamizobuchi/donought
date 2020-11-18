import React, { useState, useEffect } from 'react'
import spacetime from 'spacetime'
import {
	Modal,
	Badge,
	Form,
	FormGroup,
	Label,
	Input,
	Button,
	ModalHeader,
	ModalBody,
	ButtonGroup
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
		logged,
		consecutive
	} = props

	const {
		refresh,
		setRefresh
	} = props.refresh;

	// testing new progress
	const Streak = (props) => {
		var bg_color = "bg-light";
		if (props.success != null) {
			bg_color = props.success ? "bg-success" : "bg-danger";
		}
		var style = {
			borderRadius: "10px",
			border: "2px solid #999",
			width: "20px",
			height: "20px"

		}
		return (
			<div className="d-inline-block mx-2">
				<div style={style} className={bg_color}></div>
			</div>
		)
	}

	const [streaks, setStreaks] = useState([]);

	// Use Effect Hook
	useEffect(() => {
		const ndays = 5;
		const nlogs = logs.length;
		var j = 0;
		let s_tz = spacetime.now('America/New_York');
		let strks = new Array(ndays);
		for (var i = 0; i < ndays; i++) {
			if (j > nlogs - 1) {
				strks[i] = (<Streak success={null} />);
			} else {
				let day_to_compare = spacetime(logs[nlogs - 1 - j].createdAt);
				let d = s_tz.subtract(i, 'days');
				if (day_to_compare.isBetween(d.startOf('day'), d.endOf('day'))) {
					strks[i] = (<Streak success={logs[j].success} />);
					j += 1;
				} else {
					strks[i] = (<Streak success={null} />);
				}
			}
			setStreaks(strks)
		}
	}, [])

	// Form modal
	const toggleLogModal = (e) => {
		e.preventDefault()
		setModal(true)
	}

	// Log Button
	const logButton = (logged) ?
		(<button className="btn btn-primary disabled">Log</button>) :
		(<button className="btn btn-primary" onClick={toggleLogModal}>Log</button>);

	// Render
	return (
		<div className="row shadow rounded py-2 my-3 align-items-center justify-content-around">
			<div className="col">{task.title}</div>
			<div className="col">
				<span className="badge badge-pill badge-warning">
					{consecutive}
				</span>
			</div>
			<div className="col-5">
				<div className="row align-items-center">
					Last 5:
					{streaks}
				</div>
			</div>
			<div className="col">
				{logButton}
			</div>
			<div className="col">
				<button class="btn btn-primary" type="button" data-toggle="collapse" data-target={"#task-" + task._id} aria-expanded="false" aria-controls="collapseExample">
					&#8897;
  			</button>
			</div>

			<div class="collapse container" id={"task-" + task._id}>
				<hr></hr>
				<TaskMenu tid={task._id} refresh={props.refresh} />
			</div>

			<LogFormModal refresh={{ refresh, setRefresh }} tid={task._id} alert={{ alert, setAlert }} modal={modal} setModal={setModal} />
		</div>
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
		<button className="btn btn-danger" onClick={handleDelete}>Leave this task</button>
	)
}