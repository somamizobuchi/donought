import React from 'react'
import { Navbar, Nav, NavItem, NavLink } from 'reactstrap'
// import { Link } from 'react-router-dom'

export default function DashNav() {
	return (
		<Navbar color="light">
			<Nav>
				<NavItem>
					<NavLink>DashNav</NavLink>
				</NavItem>
			</Nav>
		</Navbar>
	)
}
