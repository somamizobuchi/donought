import React, { useEffect, useState } from "react";
import { Spinner, Button } from 'reactstrap'
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

	if (tasks.length > 0) {
		return (
			<div className="row">
				{tasks.map(task => (
					<div className="col-sm-12 col-md-6 col-lg-4 mt-3" >
						<Task
							key={task._id}
							refresh={{ refresh, setRefresh }}
							task={task.task}
							consecutive={task.consecutive}
							logs={task.logs}
							logged={task.isLogged} />
					</div>
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
				<Button onClick={() => push('/explore')} color="primary">
					Explore Donoughts!
				</Button>
			</div>
		)
	}
}
