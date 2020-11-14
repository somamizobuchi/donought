import React, { useState, useContext } from 'react'
import { Button, Form, FormGroup, Label, Input, Alert, Spinner } from 'reactstrap';
import { UserContext } from '../UserContext'
import { Link } from 'react-router-dom'

export default function LoginForm() {

	const { user, setUser } = useContext(UserContext);

	const [form, setState] = useState({
		email: '',
		password: ''
	});

	const [alert, setAlert] = useState({
		open: false,
		message: ""
	})

	const [loading, setLoading] = useState(false)

	const updateField = (e) => {
		setState({
			...form,
			[e.target.name]: e.target.value
		})
	}

	// Login 
	const handleSubmit = (e) => {
		// loading...
		setLoading(true);
		// Prevent default submit behavior
		e.preventDefault();
		// Validate
		if (!form.email || !form.password) {
			setAlert({
				...alert,
				open: true,
				message: "Please fill in all fields"
			})
			setLoading(false);
			return;
		}
		// Header information
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(form)
		};
		// request
		fetch('/api/user/login', requestOptions)
			.then(res => res.json())
			.then(json => {
				if (json.ok) {
					console.log(json);
					// setUser({
					// 	_id: json._id,
					// 	email: json.email,
					// 	firstname: json.firstname,
					// 	lastname: json.lastname,
					// 	_role: json._role,
					// 	authorized: json.ok,
					// 	timezone: json.timezone,
					// 	tasks: []
					// })
				} else {
					setAlert({
						...alert,
						open: true,
						message: json.message
					})
				}
				setLoading(false);
			})
			.catch(err => console.log(err.message));
	}

	return (
		<div className="md-auto container">
			<div className="row justify-content-center">
				<Form className="p-50 col-sm-12 col-md-6 col-lg-4">
					<h2>Login</h2>
					<Alert isOpen={alert.open} color="danger">{alert.message}</Alert>
					<FormGroup>
						<Label for="email">Email:</Label>
						<Input value={form.email} type="email" name="email" onChange={updateField}></Input>
					</FormGroup>
					<FormGroup>
						<Label for="password">Password:</Label>
						<Input value={form.password} type="password" name="password" onChange={updateField}></Input>
					</FormGroup>
					{loading ? (<Button><Spinner size="sm" color="light" /></Button>) : (<Button onClick={handleSubmit}>Login</Button>)}
				</Form>
			</div>
		</div>
	);
}
