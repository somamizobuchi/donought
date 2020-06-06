import React, { useEffect, useState } from "react";
import Task from './MyTaskCard'
import { Spinner, Button } from 'reactstrap'
import { useHistory } from 'react-router-dom'
import moment from 'moment'

export default function Tasks() {

	// React Router
	const { push } = useHistory()

	// UI state
	const [refresh, setRefresh] = useState(false);

	// tasks state
	const [tasks, setTasks] = useState([]);

	// loading state
	const [loading, setLoading] = useState(true);

	// Before component render: 
	useEffect(() => {
		fetch('/api/user/tasks')
			.then(res => res.json())
			.then(json => {
				// Check if logged today
				json.forEach(task => {
					const createdAt = moment(task.logs[task.logs.length - 1].createdAt);
					const startOfDay = moment().startOf('day');
					if (createdAt.isAfter(startOfDay)) {
						task.logged = true
					} else {
						task.logged = false
					}
				})
				return json
			})
			.then(tasks => {
				setTasks(tasks)
			})
			.catch(err => {
				console.log(err)
			})
		setLoading(false)
	}, [])

	if (tasks.length > 0) {
		return (
			<>
				{tasks.map(task => (
					<Task setRefresh={setRefresh}
						refresh={refresh}
						key={task.task._id}
						task={task.task}
						consecutive={task.consecutive}
						logs={task.logs}
						logged={task.logged}
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
