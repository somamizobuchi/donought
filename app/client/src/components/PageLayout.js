import React, { useEffect, useState } from 'react'
import loadable from '@loadable/component'
import ProtectedRoute from './ProtectedRoute'

export default function PageLayout({ children }) {
	const Home = loadable(() => import('./Home'));
	const Dashboard = loadable(() => import('./Dashboard'));

	return (
		<>
			<ProtectedRoute path="/" Component={Dashboard} Fallback={Home} />
		</>
	)
} 