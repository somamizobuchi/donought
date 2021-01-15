import React, { useState } from 'react'
import TaskForm from '../Dashboard/TaskForm';
import { Modal } from '../Modal'

export default function Admin() {
	const [modalOpen, setModalOpen] = useState(false);

	const openModal = (e) => {
		e.preventDefault();
		setModalOpen(true);
	}
	return (
		<>
			<button className="btn bg-primary" onClick={openModal}>Create New Task</button>
			<Modal open={modalOpen} setOpen={setModalOpen}>
				<TaskForm />
			</Modal>
		</>
	)
}