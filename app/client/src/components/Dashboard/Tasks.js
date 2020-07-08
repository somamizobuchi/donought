import React, { useEffect, useState } from "react";
import { Spinner, Button, Col, Row } from 'reactstrap'
import { useHistory } from 'react-router-dom'
import Loadable from 'react-loadable'

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
		loading: "Loading...",
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
			<>
				<Row >
					{tasks.map(task => (
						<Col sm="12" md="6" lg="4" className="mt-3">
							<Task
								refresh={{ refresh, setRefresh }}
								key={task.task._id}
								task={task.task}
								consecutive={task.consecutive}
								logs={task.logs}
								logged={task.isLogged} />
						</Col>
					))}
				</Row>
			</>
		);
	} else if (loading) {
		return (
			<Row><Col className="text-center"><Spinner /></Col></Row>
		)
	} else {
		return (
			<Col className="text-center mt-3">
				<Button onClick={() => push('/explore')} color="primary">
					Explore Donoughts!
				</Button>
			</Col>
		)
	}
}
