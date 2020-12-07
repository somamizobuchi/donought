import React, { useState, useContext } from 'react'
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
						firstname: res.firstname,
						lastname: res.lastname,
						_role: res._role,
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
		const registerForm = document.querySelector("#registerUserForm")

		let flag = false;
		Array.from(registerForm.querySelectorAll("input")).forEach(input => {
			if (input.value === '') {
				input.classList.add("is-invalid");
				flag = true;
			}
		})

		if (flag) {
			setAlert({ ...alert, message: "Please fill out all fields" })
			setLoading(false);
			return;
		} else {
			// Create new user
			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form)
			}
			fetch('/api/user/new', requestOptions)
				.then(res => {
					handleHttpResponse(res)
				})
				.catch(err => {
					console.log(err);
				})
		}
	}
	return (
		<form autoComplete="off" className="bg-white rounded p-3 shadow" id="registerUserForm">
			<h2>Sign Up</h2>
			<div className="form-row">
				<div className="form-group col-sm-6">
					<input type="text" className="form-control" name="firstname" placeholder="First name" onChange={updateField} value={form.firstname} autoComplete="on" />
				</div>
				<div className="form-group col-sm-6">
					<input type="text" className="form-control" name="lastname" placeholder="Last name" onChange={updateField} value={form.lastname} autoComplete="on" />
				</div>
			</div>
			<div className="form-group">
				<input type="email" className="form-control" name="email" placeholder="Email" onChange={updateField} value={form.email} autoComplete="off" />
			</div>
			<div className="form-group">
				<input type="password" className="form-control" name="password" placeholder="Password" onChange={updateField} value={form.password} autoComplete="on" />
			</div>
			{loading ? (
				<button className="btn btn-primary"></button>
			) : (
					<button type="submit" className="btn btn-primary" onClick={handleSubmit}>Sign up</button>
				)}
			<div className="text-danger">{alert.message}</div>
		</form>
	)
}