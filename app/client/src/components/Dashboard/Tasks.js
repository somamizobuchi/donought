import React, { useContext, useEffect, useState } from "react";
import { UserContext } from '../../UserContext'
import Task from './Task'
import { Row, Container, Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import TaskForm from './TaskForm'

export default function Tasks() {
	// Get user context
	const { user, setUser } = useContext(UserContext)

	// loading state
	const [loading, setLoading] = useState(true);

	// UI state
	const [refresh, setRefresh] = useState(false);

	// tasks state
	const [tasks, setTasks] = useState([]);

	// Before component render: 
	useEffect(() => {
		fetch(`/api/task/${user._id}`)
			.then(res => res.json())
			.then(doc => {
				setTasks(doc.tasks);
			})
			.then(setLoading(false))
			.then(setRefresh(false))
	}, [refresh, tasks.length])


	// Render
	return (
		<>
			<Container>
				<Row>
					<FormModal refresh={refresh} setRefresh={setRefresh} />
				</Row>
				<Row>
					{loading ? (<Loader />) : (<TaskCards refresh={refresh} setRefresh={setRefresh} tasks={tasks} />)}
				</Row>
			</Container>
		</>
	);
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

const Loader = (props) => {
	if (props.loading) {
		return (
			<div className="spinner-border text-primary" role="status">
				<span className="sr-only">Loading...</span>
			</div>
		)
	} else {
		return null;
	}
}

const TaskCards = (props) => {
	const tasks = props.tasks || [];
	const refresh = props.refresh;
	const setRefresh = props.setRefresh;
	return (
		<>
			{
				tasks.map(task => (
					<Task refresh={refresh} setRefresh={setRefresh} key={task._id} title={task.title} cat={task.category} desc={task.description} tid={task._id} />
				))
			}
		</>
	)
}

