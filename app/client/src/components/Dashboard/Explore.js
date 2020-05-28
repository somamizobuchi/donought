import React, { useEffect, useState } from 'react'
import TaskCard from './TaskCard'
import TaskForm from './TaskForm'
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap'




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
			<FormModal refresh={refresh} setRefresh={setRefresh} />
			<h1>Explore</h1>
			{
				tasks.map(task => (
					<TaskCard refresh={refresh} setRefresh={setRefresh} key={task._id} title={task.title} cat={task.category} desc={task.description} tid={task._id} numUsers={task.numUsers} />
				))
			}
		</>
	)
}

const FormModal = (props) => {
	// props
	const refresh = props.refresh;
	const setRefresh = props.setRefresh;

	// Modal State
	const [modal, setModal] = useState(false);
	const toggle = () => setModal(!modal);

	// render
	return (
		<>
			<Button onClick={toggle} color="success">New</Button>
			<Modal isOpen={modal} toggle={toggle}>
				<ModalHeader toggle={toggle}>
					New Donought
    		</ModalHeader>
				<ModalBody>
					<TaskForm refresh={refresh} setRefresh={setRefresh} toggle={toggle} />
				</ModalBody>
			</Modal>
		</>
	)
}

export default Explore;