import React, { useContext, useState } from 'react';


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
			.catch(err => {
				console.log(err.message);
			})
	}

	// render
	return (
		<div>
			<form>
				<label htmlFor="title">Title</label>
				<input value={form.title} type="text" name="title" onChange={updateField}></input>
				<label htmlFor="category">Category</label>
				<input value={form.category} type="text" name="category" onChange={updateField}></input>
				<label htmlFor="description">Description</label>
				<input value={form.description} type="text" name="description" onChange={updateField}></input>
			</form>
			<button onClick={handleSubmit}>Create</button>
		</div>
	)
}


