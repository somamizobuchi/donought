import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../logo.svg'
import googleGLogo from '../google_g_logo.svg'

const HomeNav = (props) => {

	return (
		<nav className="nav-main bg-ui-dark">
			<div className="container nav-container">
				<div className="nav-logo">
					<Link to="/">
						<img src={logo} alt="logo" />
					</Link>
				</div>
				<div className="nav-controls">
					<a href="/api/auth/google" className="btn" id="btn-google-signin">
						<img src={googleGLogo} alt="" />
						Sign in with Google
					</a>
				</div>
			</div>
		</nav>
	)
}

export default HomeNav;