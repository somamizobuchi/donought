import React, { useContext } from 'react'
import logo from '../logo.svg'
import { Link } from 'react-router-dom'
import { UserContext } from '../UserContext'
import LoginForm from './LoginForm'
import loadable from '@loadable/component';

export default function MainNav(props) {

	const { user, setUser } = useContext(UserContext);

	// Dynamic import
	const DashNav = loadable(() => import('./Dashboard/DashNav'))
	const HomeNav = loadable(() => import('./HomeNav'));

	let NavContent;
	let LoginCollapse;
	if (user.authorized === true) {
		NavContent = <DashNav user={user} />
	} else if (user.authorized === false) {
		NavContent = <HomeNav />
		LoginCollapse = (
			<div className="collapse" id="loginFormCollapse">
				<LoginForm />
			</div>
		)
	} else {
		NavContent = <HomeNav />
		LoginCollapse = (
			<div className="collapse" id="loginFormCollapse">
				<LoginForm />
			</div>
		)
	}

	// Render
	return (
		<>
			{user.authorized ? <DashNav /> : <HomeNav />}
			{/* <div className="navbar navbar-dark bg-dark">
				<Link to="/" className="navbar-brand" >
					<img src={logo} width="32px" alt="logo" />
				</Link>
				{NavContent}
			</div>
			<div className="container bg-light justify-content-center">
				{LoginCollapse}
			</div> */}
		</>
	)
}