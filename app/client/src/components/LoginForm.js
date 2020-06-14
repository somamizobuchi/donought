import React, { useState, useContext } from 'react'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { UserContext } from '../UserContext'
import { Link } from 'react-router-dom'

export default function LoginForm() {

	const { user, setUser } = useContext(UserContext);

	const [form, setState] = useState({
		email: '',
		password: ''
	});
	const updateField = (e) => {
		setState({
			...form,
			[e.target.name]: e.target.value
		})
	}

	// Login 
	const handleSubmit = (e) => {

		e.preventDefault();
		// Header information
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(form)
		};
		fetch('/api/user/login', requestOptions)
			.then(res => res.json())
			.then(json => {
				setUser({
					_id: json._id,
					email: json.email,
					authorized: json.ok,
					tasks: []
				})
			})
			.catch(err => console.log(err.message));
	}

	return (
		<div className="w-50 m-auto">
			<Form className="p-50">
				<h2>Login</h2>
				<FormGroup>
					<Label for="email">Email:</Label>
					<Input value={form.email} type="email" name="email" onChange={updateField}></Input>
				</FormGroup>
				<FormGroup>
					<Label for="password">Password:</Label>
					<Input value={form.password} type="password" name="password" onChange={updateField}></Input>
				</FormGroup>
				<Button onClick={handleSubmit}>Login</Button>
			</Form>
			<hr></hr>
			<p>Or</p>
			<Link to="/" className="btn btn-primary">Register</Link>
		</div>
	);
}
