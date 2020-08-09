import React, { useState, useContext } from 'react'
import { Alert, Spinner } from 'reactstrap'
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
		<div className="row justify-content-center">
			<form autocomplete="off" className="col-sm-8 col-md-7 md-auto">
				<Alert isOpen={alert.open} color="danger">{alert.message}</Alert>
				<h2>Sign Up</h2>
				<div className="form-row">
					<div className="form-group col-sm-6">
						<input type="text" class="form-control" name="firstname" placeholder="First name" onChange={updateField} value={form.firstname} />
					</div>
					<div class="form-group col-sm-6">
						<input type="text" class="form-control" name="lastname" placeholder="Last name" onChange={updateField} value={form.lastname} />
					</div>
				</div>
				<div class="form-group">
					<input type="email" class="form-control" name="email" placeholder="Email" onChange={updateField} value={form.email} />
				</div>
				<div class="form-group">
					<input type="password" class="form-control" name="password" placeholder="Password" onChange={updateField} value={form.password} />
				</div>
				{loading ? (
					<button className="btn btn-primary"><Spinner /></button>
				) : (
						<button type="submit" class="btn btn-primary" onClick={handleSubmit}>Sign up</button>
					)}
			</form>
		</div>
	)
}