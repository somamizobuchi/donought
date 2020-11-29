import React, { useContext } from 'react'
import { UserContext } from '../../UserContext'
import {
	Switch,
	Route
} from "react-router-dom";
import loadable from '@loadable/component'
import Profile from './Profile'
import NotFound from '../NotFound'
// Dynamic imports
const User = loadable(() => import('../User'));
const Tasks = loadable(() => import('./Tasks'));
const Explore = loadable(() => import('./Explore'));

export default function Dashboard() {

	// Render
	return (
		<div className="container">
			<Switch>
				<Route path="/profile" component={Profile} />
				<Route path="/explore" component={Explore} />
				<Route path="/user/:id">
					<User />
				</Route>
				<Route path="/" exact={true} component={Tasks} />
				<Route path="*" component={NotFound} />
			</Switch>
		</div>
	);
}
