import React, { useState, useContext } from 'react'
import logo from '../logo.svg'
import { Link, useLocation } from 'react-router-dom'
import { UserContext } from '../UserContext'
import Loadable from 'react-loadable';

export default function MainNav(props) {

	var { user, setUser } = useContext(UserContext);

	const [currentPage, setCurrentPage] = useState(useLocation().pathname);

	const toggleActivePage = (page) => {
		if (currentPage !== page) setCurrentPage(page);
	}

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
	if (user.authorized === true) {
		NavContent = <DashNav currentPageState={{ currentPage, setCurrentPage }} />
	} else if (user.authorized === false) {
		NavContent = <HomeNav />
	} else {
		NavContent = <HomeNav />
	}

	// Render
	return (
		<div className="navbar navbar-light bg-light" color="light">
			<Link to="/" className="navbar-brand" onClick={toggleActivePage("home")}>
				<img src={logo} width="32px" alt="logo" />
			</Link>
			{NavContent}
		</div>
	)
}