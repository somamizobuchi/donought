import React, { useEffect, useState } from 'react';
import spacetime from 'spacetime'
import { Modal, ModalTitle, ModalBody, ModalFooter } from '../Modal'
import LogForm from '../Forms/LogForm'
import { FiCheck, FiX } from 'react-icons/fi'

export default function TaskTable(props) {

	// tasks state
	const [tasks, setTasks] = useState([]);
	// modal state
	const [modal, setModal] = useState(false);
	// taskId state
	const [tid, setTid] = useState(null);
	const [formSuccess, setFormSuccess] = useState(false);

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
	}, [])

	function TaskTableRow({ logs, task, logged, consecutive }) {
		// Streak
		const Streak = ({ success }) => {
			let bgClass = "bg-light";
			switch (success) {
				case null:
					bgClass = "bg-light"
					break;
				case true:
					bgClass = "bg-success"
					break;
				case false:
					bgClass = "bg-danger"
					break;
				default:
					break;
			}

			return (
				<div className={"streak-item " + bgClass} ></div>
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

		const openModal = (e, success) => {
			setModal(true);
			setFormSuccess(success);
			setTid(task._id)
		}

		// Render
		return (
			<tr className="text-light rounded shadow">
				<td>{task.title}</td>
				<td>
					🔥 {consecutive}
				</td>
				<td>
					<div className="streak-group">
						{streaks}
					</div>
				</td>
				{logged && (
					<td>
						<div className="log-controls">
							<FiCheck className="btn-round" onClick={e => openModal(e, true)} />
							<FiX className="btn-round" onClick={e => openModal(e, false)} />
						</div>
					</td>
				)}
			</tr>
		)
	}
	// Render
	return (
		<>
			<table className="task-table">
				<thead>
					<tr>
						<th>Name</th>
						<th>Streak</th>
						<th>Last 5</th>
					</tr>
				</thead>
				<tbody>
					{tasks.map(task => (
						<TaskTableRow
							key={"t" + task.task._id}
							task={task.task}
							consecutive={task.consecutive}
							logs={task.logs}
							logged={task.isLogged}
						/>
					))}
				</tbody>
			</table>
			<Modal open={modal} setOpen={setModal}>
				<ModalBody>
					<LogForm tid={tid} success={formSuccess} />
				</ModalBody>
			</Modal>
		</>
	)
}