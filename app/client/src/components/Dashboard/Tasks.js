import loadable from "@loadable/component";
import React, { useEffect, useState } from "react";
import { Modal, ModalBody } from '../Modal'
import LogForm from '../Forms/LogForm';

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
				setTasks(tasks)
				console.log(tasks);
			})
			.catch(err => {
				console.log(err)
			})
	}, [])


	const getWeekdayChars = (tz) => {
		const ndays = 5;
		const weekdays = new Array(ndays);
		let today = new Date();
		for (var i = 0; i < ndays; i++) {
			let temp = today.setDate(today.getDate() - (i ? 1 : 0));
			weekdays[i] = new Intl.DateTimeFormat("en", {
				timeZone: tz,
				weekday: 'short'
			}).format(temp)[0];
		}
		return weekdays.reverse();
	}

	const weekdays = getWeekdayChars("America/New_York");

	const handleLog = (e, tid) => {
		e.preventDefault();
		setLogTaskId(tid);
		setLogModalOpen(true);
	}

	return (
		<>
			<h3 className="text-light p-1">Current Tasks</h3>
			<ul className="task-list text-light">
				<li className="d-flex-row py-1 justify-content-evenly align-items-center">
					<div className="task-title w-20"></div>
					<div className="w-40 font-sm d-flex-row justify-content-evenly align-items-center">
						{weekdays && weekdays.map(wd => (
							<span className="last-five-item text-center d-flex-row justify-content-around align-items-center">{wd}</span>
						))}
					</div>
					<div className="w-10 text-center">streak</div>
					<div className="w-10 text-center"></div>
				</li>
				{tasks && tasks.map(task => (
					<li className="d-flex-row py-1 justify-content-evenly align-items-center pill bg-ui-dark mb-1">
						<div className="task-title w-20">
							<a href="#">
								{task.task.title}
							</a>
						</div>
						<LastFive logs={task.logs} />
						<div className="w-10 text-center">
							{(task.streak > 1) ? `🔥 ${task.streak}` : ""}
						</div>
						<div className="w-10">
							<button className="btn bg-primary" onClick={(e) => handleLog(e, task._id)} disabled={task.logged}>Log</button>
						</div>
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

	const lastFiveLogical = (logs, tz) => {
		const ndays = 5;
		const nlogs = logs.length;
		let today = new Date();
		let logged = new Array(ndays).fill(null);
		var j = 0;
		for (var i = 0; i < ndays; i++) {
			if (j > nlogs - 1) break;
			let d = new Intl.DateTimeFormat('en-US', {
				timeZone: tz
			}).format(today.setDate(today.getDate() - (i ? 1 : 0)));
			let logDate = new Intl.DateTimeFormat('en-US', {
				timeZone: tz
			}).format(new Date(logs[nlogs - 1 - j].createdAt));
			if (d === logDate) {
				logged[i] = logs[j].success
				j++;
			} else {
				logged[i] = null;
			}
		}
		return logged.reverse();
	}
	const [lastFive, setLastFive] = useState([]);
	useEffect(() => {
		setLastFive(lastFiveLogical(logs, "America/New_York"));
	}, [])
	return (
		<div className="d-flex-col w-40 py-1 bg-dark pill">
			<div className="d-flex-row justify-content-evenly align-items-center">
				{lastFive.map(success => (
					<Item success={success} />
				))}
			</div>
		</div>
	)
}

const Item = ({ success }) => {
	const classNames = [
		'last-five-item',
		'font-sm',
		'text-dark'
	]
	var bgColor = 'bg-gray';
	switch (success) {
		case true:
			bgColor = 'bg-success';
			break;
		case false:
			bgColor = 'bg-danger';
			break;
		default:
			break;
	}
	classNames.push(bgColor);

	return (
		<span className={classNames.join(' ')}></span >
	)
}