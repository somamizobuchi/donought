import React, { useState, useContext } from 'react'
import { Form, FormGroup, Label, Input, Button, Alert, Spinner } from 'reactstrap'
import { UserContext } from '../UserContext'


export default function RegisterForm() {

	const { user, setUser } = useContext(UserContext);

	const [form, setForm] = useState({
		firstname: "",
		lastname: "",
		email: "",
		password: "",
		error: ""
	})

	const [alert, setAlert] = useState({
		open: false,
		message: ""
	})

	const [loading, setLoading] = useState(false)

	const handleHttpResponse = (res) => {
		res.json()
			.then(res => {
				if (res.ok) {
					setUser({
						...user,
						_id: res._id,
						email: res.email,
						authorized: true
					})
				} else {
					setAlert({
						...form,
						open: true,
						message: res.message
					})
				}
				setLoading(false);
			})
		return
	}

	const updateField = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value
		})
	}

	const handleSubmit = (e) => {
		setLoading(true)
		// prevent default behavior
		e.preventDefault();
		// validate form
		if (!form.email || !form.password || !form.firstname || !form.lastname) {
			setAlert({
				...alert,
				open: true,
				message: "Please fill in all fields"
			})
			setLoading(false);
			return
		}
		// Make request
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(form)
		}
		fetch('/api/user/new', requestOptions)
			.then(res => {
				handleHttpResponse(res)
			})
	}
	return (
		<div className="w-50 m-auto">
			<Form className="p-50">
				<h2>Sign Up</h2>
				<Alert color="danger" isOpen={alert.open}>{alert.message}</Alert>
				<FormGroup>
					<Label for="firstname">First:</Label>
					<Input value={form.firstname} type="text" name="firstname" onChange={updateField}></Input>
				</FormGroup>
				<FormGroup>
					<Label for="lastname">Last:</Label>
					<Input value={form.lastname} type="text" name="lastname" onChange={updateField}></Input>
				</FormGroup>
				<FormGroup>
					<Label for="email">Email:</Label>
					<Input value={form.email} type="email" name="email" onChange={updateField}></Input>
				</FormGroup>
				<FormGroup>
					<Label for="password">Password:</Label>
					<Input value={form.password} type="password" name="password" onChange={updateField}></Input>
				</FormGroup>
				{loading ? (<Button><Spinner size="sm" color="light" /></Button>) : (<Button color="success" onClick={handleSubmit}>Sign up</Button>)}
			</Form>
		</div>
	)
}