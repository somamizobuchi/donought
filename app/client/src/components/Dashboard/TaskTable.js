import React, { useEffect, useState } from 'react';
import LogFormModal from './LogFormModal'
import spacetime from 'spacetime'
import logo from '../../logo.svg'

export default function TaskTable(props) {

	// tasks state
	const [tasks, setTasks] = useState([]);

	// modal state
	const [modalTaskId, setModalTaskId] = useState(null);

	// Component Mount
	useEffect(() => {
		// Fetch user tasks
		fetch('/api/user/tasks')
			.then(res => res.json())
			.then(tasks => {
				setTasks(tasks)
			})
			.catch(err => {
				console.log(err)
			})
	})

	return (
		<>
			<table className="w-100">
				<thead>
					<tr>
						<th className="p-1 text-center">Name</th>
						<th className="p-1 text-center">Streak</th>
						<th className="p-1 text-center">Last 5</th>
						<th className="p-1 text-center">Log</th>
					</tr>
				</thead>
				<tbody>
					{tasks.map(task => (
						<TaskTableRow
							key={"t" + task.task._id}
							// refresh={{ refresh, setRefresh }}
							task={task.task}
							consecutive={task.consecutive}
							logs={task.logs}
							logged={task.isLogged}
							modalTaskId={{ modalTaskId, setModalTaskId }}
						/>
					))}
				</tbody>
			</table>
			<LogFormModal tid={modalTaskId} />
		</>
	)
}

/*=====================
		Task Table Row
=====================*/
function TaskTableRow(props) {
	// Props
	const {
		task,
		logs,
		logged,
		consecutive
	} = props

	const {
		setModalTaskId,
	} = props.modalTaskId;


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
			<div className="align-middle d-inline-block mx-1 mx-md-2">
				<div style={style} className={bg_color}></div>
			</div>
		)
	}

	const [streaks, setStreaks] = useState(() => {
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
		}
		return strks;
	});

	// Use Effect Hook
	useEffect(() => {
	}, [])

	const openLogModal = (e) => {
		e.preventDefault();
		setModalTaskId(task._id);
		$("#logFormModal").modal("show");
	}

	// Render
	return (
		<tr className="shadow bg-white rounded">
			<td className="p-2 text-center rounded-left">{task.title}</td>
			<td className="p-2 text-center">
				<span className="badge badge-pill badge-light">
					🔥 {consecutive}
				</span>
			</td>
			<td className="p-2 text-center">
				{streaks}
			</td>
			<td className="p-2 text-center rounded-right">
				{logged ? (
					<span className="text-muted">Logged</span>
				) : (
						<button className="btn btn-light" onClick={openLogModal}>
							<img src={logo} alt="logo" width="24px" height="24px" />
						</button>
					)}
			</td>
		</tr>
	)
}