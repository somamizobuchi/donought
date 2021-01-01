import React, { useContext } from 'react'
import {
	Switch,
	Route
} from "react-router-dom";
import loadable from '@loadable/component'
import Profile from './Profile'
import NotFound from '../NotFound'
import DashNav from './DashNav'
// Dynamic imports
const User = loadable(() => import('../User'));
const Tasks = loadable(() => import('./Tasks'));
const Explore = loadable(() => import('./Explore'));

export default function Dashboard() {

	// Render
	return (
		<>
			<DashNav />
			<div className="container">
				<Switch>
					<Route path="/profile" component={Profile} />
					<Route path="/explore" component={Explore} />
					<Route path="/user/:id" component={User} />
					<Route path="/" exact={true} component={Tasks} />
					<Route path="*" component={NotFound} />
				</Switch>
			</div>
		</>
	);
}
