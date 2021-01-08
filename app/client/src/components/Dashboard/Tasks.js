import loadable from "@loadable/component";
import React, { useEffect, useState } from "react";
import { Modal, ModalBody } from '../Modal'
import LogForm from '../Forms/LogForm';
import spacetime from 'spacetime'

export default function Tasks() {

	// const TaskTable = loadable(() => import('./TaskTable'));
	const [tasks, setTasks] = useState([]);
	// LogModal State
	const [logModalOpen, setLogModalOpen] = useState(false);
	// LogTaskId
	const [logTaskId, setLogTaskId] = useState(null);
	// Component Mount
	useEffect(() => {
		// Fetch user tasks
		fetch('/api/user/tasks')
			.then(res => res.json())
			.then(tasks => {
				console.log(tasks)
				setTasks(tasks)
			})
			.catch(err => {
				console.log(err)
			})
	}, [])

	const handleLog = (e, tid) => {
		e.preventDefault();
		setLogTaskId(tid);
		setLogModalOpen(true);
	}

	return (
		<>
			<h3 className="text-light p-1">Current Tasks</h3>
			<ul className="task-list">
				{tasks && tasks.map(task => (
					<li className="task-item bg-ui-dark text-light">
						<div className="task-title">
							<a href="#">
								{task.task.title}
							</a>
						</div>
						<LastFive logs={task.logs} />
						<div className="task-streak">
							🔥 {task.streak}
						</div>
						<button className="btn bg-primary" onClick={(e) => handleLog(e, task._id)}>Log</button>
					</li>
				))}
			</ul >
			<Modal open={logModalOpen} setOpen={setLogModalOpen}>
				<ModalBody>
					<LogForm tid={logTaskId} />
				</ModalBody>
			</Modal>
		</>
	)
}

const LastFive = ({ logs }) => {

	const Item = ({ success }) => {
		var bgColor = "bg-light";
		switch (success) {
			case true:
				bgColor = "bg-success";
				break;
			case false:
				bgColor = "bg-danger";
				break;
			default:
				break;
		}
		return (
			<span className={"last-five-item " + bgColor}></span>
		)
	}

	const lastFiveLogical = (logs) => {
		const ndays = 5;
		const nlogs = logs.length;
		const timezone = "America/New_York"
		let today = spacetime.today(timezone);
		let logged = new Array(ndays);
		var j = 0;
		for (var i = 0; i < ndays; i++) {
			if (j > nlogs - 1) {
				logged[i] = null;
			} else {
				let logDate = spacetime(logs[nlogs - 1 - j].createdAt, timezone);
				let d = today.subtract(i, 'days');
				if (logDate.isSame(d, 'day', timezone)) {
					logged[i] = logs[0].success;
					j += 1;
				} else {
					logged[i] = null;
				}
			}
		}
		return logged;
	}
	const [lastFive, setLastFive] = useState([]);
	useEffect(() => {
		setLastFive(lastFiveLogical(logs));
	}, [])
	return (
		<div className="last-five bg-dark">
			{ lastFive && lastFive.map(success => (
				<Item success={success} />
			))}
		</div>
	)
}