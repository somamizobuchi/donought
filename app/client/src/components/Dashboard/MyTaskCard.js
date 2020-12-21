import React, { useState, useEffect } from 'react'
import spacetime from 'spacetime'
import logo from '../../logo.svg'


export default function TaskCard(props) {

	// Props
	const {
		task,
		logs,
		logged,
		consecutive
	} = props

	const {
		modalTaskId,
		setModalTaskId,
	} = props.modalTaskId;

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
			<div className="d-inline-block mx-1 mx-md-2 ">
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
	}, [refresh])

	const openModal = (e) => {
		e.preventDefault();
		setModalTaskId(task._id);
		$("#logFormModal").modal("show");
	}

	// Render
	return (
		<>
			<div className="row shadow rounded py-1 my-3 align-items-center justify-content-around bg-white" >
				<div className="col-4" style={{ cursor: "pointer" }} data-toggle="collapse" data-target={"#task-" + task._id} aria-expanded="false" aria-controls="collapse">{task.title}</div>
				<div className="col-1 align-middle">
					<div className="row align-items-center">
						<span className="badge badge-pill badge-warning">
							🔥
					{consecutive}
						</span>
					</div>
				</div>
				<div className="col-5">
					<div className="row align-items-center">
						{streaks}
					</div>
				</div>
				<div className="col-2">
					<div className="row align-items-center">
						{logged ? (
							<span className="text-muted py-2">Logged</span>
						) : (
								<button className="btn btn-light" onClick={openModal}>
									<img src={logo} alt="logo" width="24px" height="24px" />
								</button>
							)}
					</div>
				</div>
				<div className="collapse col-12" id={"task-" + task._id}>
					<div className="row">
						<div className="container">
							<hr></hr>
							<TaskDetails tid={task._id} refresh={{ refresh, setRefresh }} />
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

// Form Modal


const TaskDetails = (props) => {

	const {
		refresh,
		setRefresh
	} = props.refresh;

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
				setRefresh(!refresh)
			})
	}
	return (
		<button className="btn btn-danger" onClick={handleDelete}>Leave</button>
	)
}