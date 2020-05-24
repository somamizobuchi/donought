import React, { useContext, useState } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';


export default function TaskForm(props) {
	//    const {user, setUser} = useContext(UserContext);
	const [form, setForm] = useState({
		title: '',
		category: '',
		description: ''
	})

	// Update `form` state based on input
	const updateField = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value
		})
	}

	// fetch API 
	const handleSubmit = (e) => {
		// Prevent default "submit" action
		e.preventDefault();
		// HTTP header options
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(form)
		};
		// Make http request
		fetch('/api/task/new', requestOptions)
			.then(res => res.json())
			.then(res => {
				// toggle Modal
				props.toggle();
				// Refresh parent
				props.setRefresh(true);
			})
			.catch(err => {
				console.log(err.message);
			})
	}

	// render
	return (
		<div>
			<Form>
				<h2>Create a new Donought</h2>
				<FormGroup>
					<Label for="title">Title</Label>
					<Input value={form.title} type="text" name="title" onChange={updateField}></Input>
				</FormGroup>
				<FormGroup>
					<Label for="category">Category</Label>
					<Input value={form.category} type="text" name="category" onChange={updateField}></Input>
				</FormGroup>
				<FormGroup>
					<Label for="description">Description</Label>
					<Input value={form.description} type="text" name="description" onChange={updateField}></Input>
				</FormGroup>
			</Form>
			<Button onClick={handleSubmit}>Create</Button>
		</div>
	)
}


