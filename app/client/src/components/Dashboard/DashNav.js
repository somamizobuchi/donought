import React, { useState, useEffect } from 'react'
import { Navbar, Nav, NavItem, NavLink } from 'reactstrap'
import { Link, useLocation } from 'react-router-dom'
import classnames from 'classnames'

// Dashboard NavBar
export default function DashNav() {

	const [activeTab, setActiveTab] = useState(useLocation().pathname);

	const navItems = [
		{
			title: "Explore",
			path: "/explore"
		},
		{
			title: "My Donoughts",
			path: "/tasks"
		}
	]

	const toggle = tab => {
		if (activeTab !== tab) setActiveTab(tab);
	}
	return (
		<Nav tabs>
			{navItems.map(navItem => (
				<NavItem key={navItem.title}>
					<Link to={navItem.path}>
						<NavLink className={classnames({ 'active': activeTab === navItem.path })} onClick={() => toggle(navItem.path)}>{navItem.title}</NavLink>
					</Link>
				</NavItem>
			))}
		</Nav>
	)
}
