import React, { useState, useContext } from 'react'
import { Button, Form, FormGroup, Label, Input, Alert, Spinner } from 'reactstrap';
import { UserContext } from '../UserContext'
import { Link } from 'react-router-dom'
import login from '../components/utils/login'

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

		login(
			form.email,
			form.password,
			(err, usr) => {
				if (!err) {
					setUser(usr)
				} else {
					setAlert({
						...alert,
						open: true,
						message: err.message
					})
				}
				setLoading(false);
			}
		)
		// Header information
		// const requestOptions = {
		// 	method: 'POST',
		// 	headers: { 'Content-Type': 'application/json' },
		// 	body: JSON.stringify(form)
		// };
		// // request
		// fetch('/api/user/login', requestOptions)
		// 	.then(res => res.json())
		// 	.then(json => {
		// 		if (json.ok) {
		// 		} else {
		// 			setAlert({
		// 				...alert,
		// 				open: true,
		// 				message: json.message
		// 			})
		// 		}
		// 		setLoading(false);
		// 	})
		// 	.catch(err => console.log(err.message));

	}

	return (
		<div className="bg-light w-100 d-none d-sm-block d-md-none py-3">
			<Form className="container bg-light">
				<Alert isOpen={alert.open} color="danger">{alert.message}</Alert>
				< FormGroup >
					<Input value={form.email} type="email" name="email" onChange={updateField}></Input>
				</FormGroup >
				<FormGroup>
					<Input value={form.password} type="password" name="password" onChange={updateField}></Input>
				</FormGroup>
				{loading ? (<Button><Spinner size="sm" color="light" /></Button>) : (<Button onClick={handleSubmit}>Login</Button>)}
			</Form >
		</div>

	);
}
