import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from './UserContext';
import Loadable from 'react-loadable';

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
	// Dynamic imports
	const Dashboard = Loadable({
		loader: () => import('./components/Dashboard'),
		loading: "Loading...",
	});
	const Home = Loadable({
		loader: () => import('./components/Home'),
		loading: "Loading..."
	})

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


export default App;
