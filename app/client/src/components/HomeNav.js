import React, { useContext } from 'react'
import { Navbar, NavbarBrand, Nav, NavItem, Button } from 'reactstrap'
import logo from '../logo.png'
import { Link, useLocation } from 'react-router-dom'
import { UserContext } from '../UserContext'

export default function HomeNav({ children }) {

	var { user, setUser } = useContext(UserContext);

	let location = useLocation();

	const logout = (e) => {
		e.preventDefault();
		fetch('/api/user/logout')
			.then(res => res.json())
			.then(json => {
				if (json.ok) {
					setUser({
						...user,
						authorized: false
					})
				}
			})
	}


	let loginButton = () => {
		if (user.authorized) {
			return (
				<Button outline onClick={logout}>Logout</Button>
			)
		} else {
			if (location.pathname === "/login") {
				return (
					<Link className="btn btn-outline-primary" to="/">Register</Link>
				)
			} else {
				return (
					<Link className="btn btn-outline-primary" to="/login">Login</Link>
				)
			}
		}
	}


	// Render
	return (
		<Navbar color="light">
			<NavbarBrand>
				<Link to="/">
					<img src={logo} width="32px" alt="" />
				</Link>
			</NavbarBrand>
			<Nav>
				{children}
				<NavItem>
					{loginButton()}
				</NavItem>
			</Nav>
		</Navbar>
	)
}