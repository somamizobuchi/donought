import React, { useEffect, useState } from 'react'
import TaskCard from './TaskCard'
import { Container } from 'reactstrap';

const Explore = (props) => {

	const [tasks, setTasks] = useState([]);

	const [refresh, setRefresh] = useState(false);

	useEffect(() => {
		// Make http request
		fetch('/api/task')
			.then(res => res.json())
			.then(json => {
				console.log(json)
				setTasks(json)
			})
			.then(() => {
				setRefresh(false);
			})
			.catch(err => {
				console.log(err.message);
			})
	}, [tasks.length])
	// Render: 
	if (!tasks) {
		return (
			<>Loading</>
		)
	} else {
		return (
			<>
				<Container>
					<h1>Explore</h1>
					{
						tasks.map(task => (
							<TaskCard refresh={refresh} setRefresh={setRefresh} key={task._id} title={task.title} cat={task.category} desc={task.description} tid={task._id} />
						))
					}
				</Container>
			</>
		)
	}
}

export default Explore;