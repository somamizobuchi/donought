import React, { useEffect, useState } from "react";
import Task from './TaskCard'

export default function Tasks() {

	// UI state
	const [refresh, setRefresh] = useState(false);

	// tasks state
	const [tasks, setTasks] = useState([]);

	// Before component render: 
	useEffect(() => {
		fetch('/api/user/tasks')
			.then(res => res.json())
			.then(doc => {
				setTasks(doc);
			})
			.then(setRefresh(false))
			.catch(err => console.log(err))
	}, [])


	// Render
	return (
		<>
			<h1>My Donoughts</h1>
			{tasks.map(task => (
				<Task setRefresh={setRefresh} refresh={refresh} key={task.task._id} title={task.task.title} category={task.task.category} description={task.task.description} my={true} />
			))}
		</>
	);
}
