import React, { useState, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { UserContext } from '../../UserContext'
import { logout } from '../../utils/user_utils'
import SearchBar from './SearchBar'

// Dashboard NavBar
export default function DashNav(props) {

	var { user, setUser } = useContext(UserContext)

	const [currentPage, setCurrentPage] = useState(useLocation().pathname);

	const navItems = [
		{
			title: "Explore",
			path: "/explore",
			key: "explore"
		}
	]

	const toggle = page => {
		if (currentPage !== page) setCurrentPage(page);
	}

	const handleLogout = (e) => {
		logout()
			.then(() => {
				setUser({
					...user,
					authorized: false
				});
			})
			.catch(err => {
				console.log(err.message)
			})
	}

	return (
		<>
			<ul className="navbar-nav">
				{navItems.map(navItem => (
					<li className="nav-item" key={navItem.key}>
						<Link
							to={navItem.path}
							className="text-light nav-link"
							onClick={() => toggle(navItem.path)}
						>
							{navItem.title}
						</Link>
					</li>
				))}
			</ul>
			<li className="nav-item">
				<div className="dropdown nav-link">
					<a className="dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						{user.firstname}
					</a>
					<div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
						<Link to="/profile" className="dropdown-item">Profile</Link>
						<a className="dropdown-item text-danger" onClick={handleLogout}>Logout</a>
					</div>
				</div>
			</li>
			<SearchBar />
		</>
	)
}

