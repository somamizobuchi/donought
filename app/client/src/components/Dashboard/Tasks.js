import React, { useEffect, useState } from "react";
import Task from './TaskCard'
import { Spinner, Button, Toast } from 'reactstrap'
import { useHistory } from 'react-router-dom'

export default function Tasks() {

	const { push } = useHistory()
	// UI state
	const [refresh, setRefresh] = useState(false);

	// tasks state
	const [tasks, setTasks] = useState([]);

	const [loading, setLoading] = useState(true);

	// Before component render: 
	useEffect(() => {
		fetch('/api/user/tasks')
			.then(res => res.json())
			.then(doc => {
				setTasks(doc);
			})
			.then(setLoading(false))
			.catch(err => console.log(err))
	}, [])

	if (tasks.length > 0) {
		return (
			<>
				<h1>My Donoughts</h1>
				{tasks.map(task => (
					<Task setRefresh={setRefresh}
						refresh={refresh}
						tid={task.task._id} key={task.task._id}
						title={task.task.title}
						category={task.task.category}
						description={task.task.description}
						my={true}
					/>
				))}
			</>
		);
	} else if (loading) {
		return (
			<><Spinner /></>
		)
	} else {
		return (
			<>
				<Button onClick={() => push('/explore')} color="primary">
					Join a Donought
				</Button>
			</>
		)
	}
}
