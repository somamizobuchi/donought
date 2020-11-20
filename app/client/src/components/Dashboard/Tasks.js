import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import Loadable from 'react-loadable'
import Loading from '../Loading'

export default function Tasks() {

	// React Router
	const { push } = useHistory()

	// UI state
	const [refresh, setRefresh] = useState(false);

	// tasks state
	const [tasks, setTasks] = useState([]);

	// loading state
	const [loading, setLoading] = useState(true);


	// Loadable: MyTaskCard
	const Task = Loadable({
		loader: () => import('./MyTaskCard'),
		loading: Loading,
	});
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
				<h3>Tasks</h3>
				{tasks.map(task => (
					<Task
						key={"t" + task.task._id}
						refresh={{ refresh, setRefresh }}
						task={task.task}
						consecutive={task.consecutive}
						logs={task.logs}
						logged={task.isLogged} />
				))}
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
