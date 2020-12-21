import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import Loading from '../Loading'
import LogFormModal from './LogFormModal'
import loadable from "@loadable/component";

export default function Tasks() {

	// React Router
	const { push } = useHistory()

	// UI state
	const [refresh, setRefresh] = useState(false);

	// tasks state
	const [tasks, setTasks] = useState([]);

	// modal state
	const [modalTaskId, setModalTaskId] = useState(null);

	// loading state
	const [loading, setLoading] = useState(true);

	// Dynamic import
	const Task = loadable(() => import('./MyTaskCard'));

	// Before component render: 
	useEffect(() => {
		// Fetch user tasks
		fetch('/api/user/tasks')
			.then(res => res.json())
			.then(tasks => {
				setTasks(tasks)
				setLoading(false)
			})
			.catch(err => {
				console.log(err)
			})
	}, [refresh])

	// If user has tasks
	if (tasks.length > 0) {
		return (
			<div className="container">
				{/* <h3>Tasks</h3> */}
				<div className="row justify-content-around align-items-center">
					<div className="col-4">Name</div>
					<div className="col-1">Streak</div>
					<div className="col-5">Last 5</div>
					<div className="col-2">Log</div>
				</div>
				{tasks.map(task => (
					<Task
						key={"t" + task.task._id}
						refresh={{ refresh, setRefresh }}
						task={task.task}
						consecutive={task.consecutive}
						logs={task.logs}
						logged={task.isLogged}
						modalTaskId={{ modalTaskId, setModalTaskId }}
					/>
				))}
				<LogFormModal refresh={{ refresh, setRefresh }} tid={modalTaskId} />
			</div>
		);
	} else if (loading) {
		return (
			<Loading />
		)
	} else {
		return (
			<div className="col text-center mt-3">
				<button className="btn btn-primary" onClick={() => push('/explore')}>
					Explore Donoughts!
				</button>
			</div>
		)
	}
}
