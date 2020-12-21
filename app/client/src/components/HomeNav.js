import React, { useState, useContext } from 'react'
import { UserContext } from '../UserContext';
import { useHistory } from 'react-router-dom'
import { login } from '../utils/user_utils'

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

	const history = useHistory();

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
		} else {
			// Call util/login function
			login(
				form.email,
				form.password,
				(err, usr) => {
					if (!err) {
						setUser(usr)
						history.replace('/')
					} else {

					}
					// setLoading(false);
				}
			)
		}

	}
	return (
		<div className="nav">
			<div className="nav-item d-none d-md-block">
				<form className="form-inline">
					<label className="sr-only" htmlFor="email">Email</label>
					<input type="text" className="form-control mr-sm-2" name="email" placeholder="example@email.com" value={form.email} onChange={updateField} />
					<label className="sr-only" htmlFor="inlineFormInputGroupUsername2">Password</label>
					<input type="password" className="form-control mr-sm-2" name="password" placeholder="Password" value={form.password} onChange={updateField} autoComplete="off" />
					<button type="submit" className="btn btn-primary" onClick={handleSubmit}>Log in</button>
				</form>
			</div>
			<div className="nav-item d-block d-md-none">
				<button className="btn btn-primary" type="button" data-toggle="collapse" data-target="#loginFormCollapse" aria-expanded="false" aria-controls="collapseExample">
					Already a user?
  			</button>
			</div>
		</div>
	)
}

export default HomeNav;