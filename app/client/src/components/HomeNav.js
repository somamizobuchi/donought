import React, { useState, useContext } from 'react'
import { UserContext } from '../UserContext';

const HomeNav = (props) => {

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
					setUser({
						_id: json._id,
						email: json.email,
						firstname: json.firstname,
						lastname: json.lastname,
						_role: json._role,
						authorized: json.ok,
						timezone: json.timezone,
						tasks: []
					})
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
		<div className="nav">
			<div className="nav-item">
				<form className="form-inline">
					<label className="sr-only" for="email">Email</label>
					<input type="text" className="form-control mr-sm-2" name="email" placeholder="example@email.com" value={form.email} onChange={updateField} />
					<label className="sr-only" for="inlineFormInputGroupUsername2">Password</label>
					<input type="password" className="form-control mr-sm-2" name="password" placeholder="Password" value={form.password} onChange={updateField} />
					<button type="submit" className="btn btn-primary" onClick={handleSubmit}>Log in</button>
				</form>
			</div>
		</div>
	)
}

export default HomeNav;