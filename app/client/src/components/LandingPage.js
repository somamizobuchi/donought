import React, { useEffect, useState } from 'react'
import loadable from '@loadable/component'
import { useUserContext } from "../contexts/UserContext";

export default function PageLayout({ children }) {
	const { currentUser } = useUserContext();
	const Home = loadable(() => import('./Home'));
	const Dashboard = loadable(() => import('./Dashboard'));

	return (
		<>
			{currentUser.authorized ? (
				<Dashboard />
			) : (
					<Home />
				)}
		</>
	)
} 