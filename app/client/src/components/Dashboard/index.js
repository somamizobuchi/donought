import React, { useContext } from 'react'
import { UserContext } from '../../UserContext'
import {
	Switch,
	Route
} from "react-router-dom";
import Loadable from 'react-loadable'

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
				<Route path="/explore" component={Explore} />
				<Route path="/" component={Tasks} />
			</Switch>
		</div>
	);
}
