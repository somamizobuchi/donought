import React, { useState, useEffect } from 'react';
import Home from './components/Home'
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from './UserContext';
import Dashboard from './components/Dashboard/';

function App() {
	// Create user state -> context
	const [user, setUser] = useState({
		_id: '',
		email: '',
		authorized: false,
		tasks: []
	});

	const authorize = () => {
		fetch('/api/user/isauth')
			.then(res => res.json())
			.then(json => {
				setUser({
					_id: json._id,
					email: json.email,
					authorized: json.ok,
					tasks: []
				})
			})
			.catch(err => {
				console.log(err.message);
			})
	}

	useEffect(() => {
		authorize()
	}, [user.authorized])


	return (
		<div className="App">
			<UserProvider value={{ user, setUser }}>
				<LandingPage authorized={user.authorized} />
			</UserProvider>
		</div>
	)

}

const LandingPage = (props) => {
	const authorized = props.authorized;
	if (authorized) {
		return (
			<Dashboard />
		)
	} else {
		return (
			<Home />
		)
	}
}

export default App;
