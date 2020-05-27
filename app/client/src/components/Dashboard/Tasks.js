import React, { useContext, useEffect, useState } from "react";
import { UserContext } from '../../UserContext'
import Task from './TaskCard'
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
		fetch('/api/user/tasks')
			.then(res => res.json())
			.then(doc => {
				console.log(doc)
				setTasks(doc);
			})
			.then(setLoading(false))
			.then(setRefresh(false))
	}, [refresh])


	// Render
	return (
		<>
			<Container>
				<Row>
					<FormModal refresh={refresh} setRefresh={setRefresh} />
					{tasks.map(task => (
						<Task setRefresh={setRefresh} refresh={refresh} title={task.title} category={task.category} />
					))}
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