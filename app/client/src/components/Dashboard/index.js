import React, { useContext } from 'react'
import { UserContext } from '../../UserContext'
import { Container } from 'reactstrap'
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
		<Container>
			<Switch>
				<Route path="/" component={Tasks} />
				<Route path="/explore" component={Explore} />
			</Switch>
		</Container>
	);
}
