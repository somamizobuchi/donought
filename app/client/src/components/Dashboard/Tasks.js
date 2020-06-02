import React, { useEffect, useState } from "react";
import Task from './MyTaskCard'
import { Spinner, Button } from 'reactstrap'
import { useHistory } from 'react-router-dom'
import moment from 'moment'

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
			.then(json => {
				json.forEach(task => {
					const createdAt = moment(task.logs[0].createdAt);
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
				<h1>My Donoughts</h1>
				{tasks.map(task => (
					<Task setRefresh={setRefresh}
						refresh={refresh}
						tid={task.task._id} key={task.task._id}
						title={task.task.title}
						category={task.task.category}
						description={task.task.description}
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
