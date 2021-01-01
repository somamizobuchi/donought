import React, { useContext } from 'react'
import logo from '../logo.svg'
import { Link } from 'react-router-dom'
import { useUserContext } from '../contexts/UserContext'
import LoginForm from './LoginForm'
import loadable from '@loadable/component';

export default function MainNav(props) {

	const { user, setUser } = useUserContext();

	// Dynamic import
	const DashNav = loadable(() => import('./Dashboard/DashNav'))
	const HomeNav = loadable(() => import('./HomeNav'));

	// Render
	return (
		<>
			{user.authorized ? <DashNav /> : <HomeNav />}
		</>
	)
}