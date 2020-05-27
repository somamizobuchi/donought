import React, { useState, useEffect } from 'react'
import { Navbar, Nav, NavItem, NavLink } from 'reactstrap'
import { Link, useLocation } from 'react-router-dom'
import classnames from 'classnames'

// Dashboard NavBar
export default function DashNav() {

	const [activeTab, setActiveTab] = useState('/explore');

	const toggle = tab => {
		if (activeTab !== tab) setActiveTab(tab);
	}
	return (
		<Nav tabs>
			<NavItem >
				<Link to="/explore">
					<NavLink className={classnames({ 'active': activeTab === '/explore' })} onClick={() => toggle('/explore')}>Explore</NavLink>
				</Link>
			</NavItem>
			<NavItem>
				<Link to="/tasks">
					<NavLink className={classnames({ 'active': activeTab === '/tasks' })} onClick={() => toggle('/tasks')}>
						My Donoughts
						</NavLink>
				</Link>
			</NavItem>
		</Nav>
	)
}
