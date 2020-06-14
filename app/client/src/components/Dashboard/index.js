import React, { useContext } from 'react'
import { UserContext } from '../../UserContext'
import Tasks from './Tasks'
import DashNav from './DashNav'
import { Button, Container } from 'reactstrap'
import Explore from './Explore'
import HomeNav from '../HomeNav'
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";

export default function Dashboard() {

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
