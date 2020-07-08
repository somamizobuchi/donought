import React, { useContext } from 'react'
import { UserContext } from '../../UserContext'
import DashNav from './DashNav'
import { Container } from 'reactstrap'
import HomeNav from '../HomeNav'
import {
	BrowserRouter as Router,
	Switch,
	Route
} from "react-router-dom";
import Loadable from 'react-loadable'

export default function Dashboard() {

	const Tasks = Loadable({
		loader: () => import('./Tasks'),
		loading: "loading",
	});
	const Explore = Loadable({
		loader: () => import('./Explore'),
		loading: "loading",
	});

	var { user, setUser } = useContext(UserContext);

	const logout = (e) => {
		fetch('/api/user/logout')
			.then(res => res.json())
			.then(res => setUser({
				...user,
				authorized: false
			}))
	}

	// Render
	return (
		<Router>
			<HomeNav authorized={true} >
				<DashNav />
			</HomeNav>
			<Container>
				<Switch>
					<Route path="/tasks">
						<Tasks />
					</Route>
					<Route path="/Explore">
						<Explore />
					</Route>
				</Switch>
			</Container>
		</Router>
	);
}
