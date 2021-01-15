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
			<h3>Create New Task</h3>
			<form>
				<div className="form-group">
					<label htmlFor="title" className="d-none">Title</label>
					<input className="w-100" value={form.title} type="text" name="title" placeholder="title" onChange={updateField}></input>
				</div>
				<div className="form-group">
					<label htmlFor="category" className="d-none">Category</label>
					<input className="w-100" value={form.category} type="text" name="category" placeholder="category" onChange={updateField}></input>
				</div>
				<div className="form-group">
					<label htmlFor="description" className="d-none">Description</label>
					<input className="w-100" value={form.description} type="text" name="description" placeholder="description" onChange={updateField}></input>
				</div>
			</form>
			<button className="btn bg-primary" onClick={handleSubmit}>Create</button>
		</div>
	)
}


