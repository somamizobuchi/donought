import React, { useState, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { UserContext } from '../../UserContext'
import classnames from 'classnames'

// Dashboard NavBar
export default function DashNav(props) {

	var { user, setUser } = useContext(UserContext)
	// console.log(user);
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
				<Link to="/user/id" className="nav-link">{user.firstname}</Link>
			</div>
		</div>
	)
}
