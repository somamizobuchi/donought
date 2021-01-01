import React, { useState } from 'react'
import { useUserContext } from '../contexts/UserContext'
import { login } from '../utils/user_utils'

export default function LoginForm() {

	const { user, setUser } = useUserContext();

	const [form, setForm] = useState({
		email: '',
		password: ''
	});

	const [alert, setAlert] = useState({
		open: false,
		message: ""
	})

	const [loading, setLoading] = useState(false)

	const updateField = (e) => {
		setForm({
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
		} else {
			// call login function
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
		}
	}



	return (
		<div className="d-block d-md-none py-3 bg-light w-75 m-auto">
			<form autoComplete="on">
				<div className="form-group">
					<input className="form-control" value={form.email} type="email" name="email" onChange={updateField} placeholder="Email" />
				</div>
				<div className="form-group">
					<input autoComplete="off" className="form-control" value={form.password} type="password" name="password" onChange={updateField} placeholder="Password" />
				</div>
				<button className="btn btn-primary btn-block" onClick={handleSubmit}>Log in</button>
				{/* {loading ? (<Button><Spinner size="sm" color="light" /></Button>) : (<Button onClick={handleSubmit}>Login</Button>)} */}
			</form>
		</div>

	);
}
