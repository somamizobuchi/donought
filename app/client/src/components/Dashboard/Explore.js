import React, { useEffect, useState } from 'react'
import TaskCard from './TaskCard'
// import TaskForm from './TaskForm'

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
			{/* <FormModal refresh={refresh} setRefresh={setRefresh} /> */}
			{
				tasks.map(task => (
<<<<<<< HEAD
					<div className="row py-3" >
						<TaskCard refresh={refresh} setRefresh={setRefresh} key={task._id} title={task.title} cat={task.category} desc={task.description} tid={task._id} numUsers={task.numUsers} />
=======
					<div className="row mt-3" >
						<div className="col">
							<TaskCard refresh={refresh} setRefresh={setRefresh} key={"t" + task._id} title={task.title} cat={task.category} desc={task.description} tid={task._id} numUsers={task.numUsers} />
						</div>
>>>>>>> myTaskCardRemake
					</div>
				))
			}
		</>
	)
}



export default Explore;