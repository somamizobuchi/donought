import React, { useContext } from 'react'
import logo from '../logo.svg'
import { Link } from 'react-router-dom'
import Loadable from 'react-loadable';
import { UserContext } from '../UserContext'
import LoginForm from './LoginForm'

export default function MainNav(props) {

	const { user, setUser } = useContext(UserContext);

	// Loading component
	const Loading = () => {
		return <></>
	}

	// Dynamic import
	const DashNav = Loadable({
		loader: () => import('./Dashboard/DashNav'),
		loading: Loading
	})

	const HomeNav = Loadable({
		loader: () => import('./HomeNav'),
		loading: Loading
	})

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
			<div className="navbar navbar-light bg-light" color="light">
				<div className="container">
					<Link to="/" className="navbar-brand" >
						<img src={logo} width="32px" alt="logo" />
					</Link>
					{NavContent}
				</div>
			</div>
			{LoginCollapse}
		</>
	)
}