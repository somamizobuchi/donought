import React, { useEffect, useState } from 'react'
import Task from './Task'

const Explore = (props) => {

	const [tasks, setTasks] = useState([]);


	useEffect(() => {
		// Make http request
		fetch('/api/task')
			.then(res => res.json())
			.then(json => {
				console.log(json)
				setTasks(json)
			})
			.catch(err => {
				console.log(err.message);
			})
	}, [tasks.lenght])
	// Render: 
	if (!tasks) {
		return (
			<>Loading</>
		)
	} else {
		return (
			<>
				<h1>Explore</h1>
				{
					tasks.map(task => (
						<Task key={task._id} title={task.title} cat={task.category} desc={task.description} tid={task._id} />
					))
				}
			</>
		)
	}
}

export default Explore;