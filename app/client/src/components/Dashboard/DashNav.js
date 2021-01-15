import React, { useState, useEffect } from 'react'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { useUserContext } from '../../contexts/UserContext'
import SearchBar from './SearchBar'
import logo from '../../logo.svg'
import { FiSearch, FiMenu, FiX, FiCompass } from 'react-icons/fi'


const DashNav = (props) => {
	// BROWSER HISTORY
	const history = useHistory();
	// CURRENT USER CONTEXT
	const { currentUser, signOut } = useUserContext()
	// STATES
	const [navCollapseOpen, setNavCollapseOpen] = useState(false);
	const [navCollapseClassNames, setNavCollapseClassNames] = useState("nav-collapse");
	const [navCollapseBg, setNavCollapseBg] = useState("nav-collapse-bg");
	const [searchBarOpen, setSearchBarOpen] = useState(false);

	const navItems = [
		{
			title: "Explore",
			path: "/explore",
			key: "explore"
		}
	]

	const handleSignout = (e) => {
		e.preventDefault();
		signOut()
			.then(() => {
				history.replace('/');
			})
	}

	const handleNavToggle = e => {
		if (navCollapseOpen) {
			setNavCollapseBg("nav-collapse-bg");
			setNavCollapseClassNames("nav-collapse nav-collapse-slide-out");
			setNavCollapseOpen(!navCollapseOpen)
		} else {
			setNavCollapseClassNames("nav-collapse nav-collapse-slide-in");
			setNavCollapseBg("nav-collapse-bg bg-blur nav-collapse-bg-show");
			setSearchBarOpen(false);
			setNavCollapseOpen(!navCollapseOpen);
		}
	}
	return (
		<nav className="nav-main bg-ui-dark position-relative">
			<div className="container nav-container">
				<div className="nav-logo col-1">
					<Link to="/">
						<img src={logo} alt="logo" />
					</Link>
				</div>
				<div className="nav-controls">
					<FiCompass className="nav-control-item" onClick={() => history.push("/explore")} />
					<FiSearch className="nav-control-item" onClick={() => setSearchBarOpen(true)} />
					<FiMenu className="nav-control-item" onClick={handleNavToggle} />
				</div>
				<div className={navCollapseBg} onClick={handleNavToggle}>
					<span className="nav-close" onClick={handleNavToggle}><FiX /></span>
					<div className={navCollapseClassNames} onClick={e => e.stopPropagation()}>
						<div className="nav-profile">
							<img src={currentUser.picture} alt="" />
							<Link to={`/user/${currentUser._id}`} className="btn">
								<p>{currentUser.firstname}</p>
							</Link>
						</div>
						<ul className="container">
							{navItems.map(navItem => (
								<li key={navItem.key}>
									<Link
										to={navItem.path}
										className="text-light nav-link"
										onClick={handleNavToggle}
									>
										{navItem.title}
									</Link>
								</li>
							))}
							<li>
								<a href="" className="btn bg-danger" onClick={handleSignout}>
									Sign out
							</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<SearchBar open={searchBarOpen} setOpen={setSearchBarOpen} />
		</nav >

	)
}
export default DashNav;