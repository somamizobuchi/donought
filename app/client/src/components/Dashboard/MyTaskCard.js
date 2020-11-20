import React, { useState, useEffect } from 'react'
import spacetime from 'spacetime'
import { BsCheck, BsChevronCompactDown, BsPlusCircle, BsCircle, BsX, BsList } from 'react-icons/bs';
import { log_task } from '../utils/task_utils'
import logo from '../../logo.svg'
import Toggle from 'react-toggle'


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

	// Streak
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
				strks[i] = (<Streak key={"t-" + task._id + i} success={null} />);
			} else {
				let day_to_compare = spacetime(logs[nlogs - 1 - j].createdAt);
				let d = s_tz.subtract(i, 'days');
				if (day_to_compare.isBetween(d.startOf('day'), d.endOf('day'))) {
					strks[i] = (<Streak key={"t-" + task._id + i} success={logs[j].success} />);
					j += 1;
				} else {
					strks[i] = (<Streak key={"t-" + task._id + i} success={null} />);
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


	const LogButtons = (props) => {

		const handleLog = (e) => {
			e.preventDefault();
			console.log("hello world");
		}

		return (
			<>
				<button className="btn btn-light" data-toggle="modal" data-target="#logModal">
					<img src={logo} alt="logo" width="24px" height="24px" />
				</button>
			</>
		)
	}

	// Render
	return (
		<div className="row shadow rounded py-1 my-3 align-items-center justify-content-around" >
			<div className="col-auto" data-toggle="collapse" data-target={"#task-" + task._id} aria-expanded="false" aria-controls="collapse">{task.title}</div>
			<div className="col-auto">
				<span className="badge badge-pill badge-warning">
					🔥
					{consecutive}
				</span>
			</div>
			<div className="col-auto">
				<div className="row align-items-center">
					{streaks}
				</div>
			</div>
			<div className="col-auto">
				<div className="row align-items-center">
					<LogButtons />
				</div>
			</div>

			<div className="collapse container" id={"task-" + task._id}>
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

		log_task(form, (err, res) => {
			if (err) {
				props.alert.setAlert({
					...alert,
					isOpen: true,
					color: "success",
					message: "Successs"
				})
			} else {
				props.refresh.setRefresh(!props.refresh.refresh);
			}
		})
	}

	const toggleModal = () => {
		props.setModal(!props.modal)
	}

	// Render Modal
	return (
		<div className="modal fade" id="logModal" aria-labelby="logModal" tabindex="-1" role="dialog">
			<div className="modal-dialog" role="document">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">How did you do today?</h5>
						<button type="button" className="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div className="modal-body">
						<form>
							<label>
								<Toggle
									defaultChecked={form.success}
									icons={false}
								/>
							</label>
							<div className="form-group">
								<input className="form-control" name="comment" type="text" value={form.content} onChange={updateForm} placeholder="Anything to say?" />
							</div>
						</form>
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-primary">Sumbit</button>
						<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
					</div>
				</div>
			</div>
		</div>
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
		<button className="btn btn-danger" onClick={handleDelete}>Leave</button>
	)
}