import React, { useState, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { UserContext } from '../../UserContext'
import classnames from 'classnames'

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

	const logout = (e) => {
		fetch('api/user/logout')
			.then(res => res.json())
			.then(res => {
				setUser({
					...user,
					authorized: false
				})
			})
	}

	return (
		<div className="nav">
			{navItems.map(navItem => (
				<div className="nav-item" key={navItem.key}>
					<Link
						to={navItem.path}
						className={
							classnames(
								{
									'text-dark': currentPage === navItem.path,
									'text-muted': currentPage !== navItem.path,
									'nav-link': true
								})}
						onClick={() => toggle(navItem.path)}
					>
						{navItem.title}
					</Link>
				</div>
			))}
			<div className="nav-item">
				<div class="dropdown nav-link">
					<a class="dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						{user.firstname}
					</a>
					<div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
						<Link to="/profile" className="dropdown-item">Profile</Link>
						<a className="dropdown-item text-danger" onClick={logout}>Logout</a>
					</div>
				</div>
			</div>
		</div>
	)
}
