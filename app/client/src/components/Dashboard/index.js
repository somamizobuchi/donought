import React, { useContext } from 'react'
import { UserContext } from '../../UserContext'
import {
	Switch,
	Route
} from "react-router-dom";
import Loadable from 'react-loadable'
import Profile from './Profile'
import NotFound from '../NotFound'
import User from '../User'

export default function Dashboard() {

	const Loading = () => {
		return <></>
	}
	// Dynamic Imports
	const Tasks = Loadable({
		loader: () => import('./Tasks'),
		loading: Loading,
	});
	const Explore = Loadable({
		loader: () => import('./Explore'),
		loading: Loading,
	});

	var { user, setUser } = useContext(UserContext);

	// Render
	return (
		<div className="container">
			<Switch>
				<Route path="/profile" component={Profile} />
				<Route path="/explore" component={Explore} />
				<Route path="/user/:id" component={User} />
				<Route path="/" exact={true} component={Tasks} />
				<Route path="*" component={NotFound} />
			</Switch>
		</div>
	);
}
