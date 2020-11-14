import React, { useState, useEffect } from 'react';
import './custom.scss';
import { UserProvider } from './UserContext';
import Loadable from 'react-loadable';
import MainNav from './components/MainNav';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
	// Create user state -> context
	const [user, setUser] = useState({
		_id: '',
		email: '',
		firstname: '',
		lastname: '',
		authorized: null,
		tasks: []
	});

	useEffect(() => {
		fetch('/api/user/isauth')
			.then(res => res.json())
			.then(json => {
				setUser({
					_id: json._id,
					email: json.email,
					firstname: json.firstname,
					lastname: json.lastname,
					timezone: json.timezone,
					authorized: json.ok,
					tasks: []
				})
			})
			.catch(err => {
				console.log(err.message)
			})
	}, [])

	return (
		<div className="App">
			<UserProvider value={{ user, setUser }}>
				<Router>
					<MainNav authorized={user.authorized} />
					<LandingPage authorized={user.authorized} />
				</Router>
			</UserProvider>
		</div>
	)
}


const LandingPage = (props) => {

	const { authorized } = props;

	const Loading = (props) => {
		return <></>
	}

	const Home = Loadable({
		loader: () => import('./components/Home'),
		loading: Loading
	})

	const Dashboard = Loadable({
		loader: () => import('./components/Dashboard'),
		loading: Loading
	})

	switch (authorized) {
		case (false):
			return (<Home />)
		case (true):
			return (<Dashboard />)
		default:
			return (<Loading />)
	}
}

export default App;
