import React, { useEffect, useState } from 'react'
import TaskCard from './TaskCard'

const Explore = (props) => {

	const [tasks, setTasks] = useState([]);

	const [refresh, setRefresh] = useState(false);

	useEffect(() => {
		// Make http request
		fetch('/api/task')
			.then(res => res.json())
			.then(json => {
				setTasks(json)
			})
			.then(setRefresh(false))
			.catch(err => {
				console.log(err.message);
			})
	}, [])
	// Render: 
	return (
		<>
			<h3 className="text-light p-1">Top</h3>
			<ul className="d-flex-col text-light">
				{
					tasks.map(task => (
						<TaskCard refresh={refresh} setRefresh={setRefresh} key={"t" + task._id} title={task.title} cat={task.category} desc={task.description} tid={task._id} numUsers={task.numUsers} />
					))
				}
			</ul>
		</>
	)
}



export default Explore;