import React, { useState, useEffect } from 'react'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { useUserContext } from '../../contexts/UserContext'
import { logout } from '../../utils/user_utils'
import SearchBar from './SearchBar'
import logo from '../../logo.svg'
import Requests from './Requests'


const DashNav = (props) => {

	const history = useHistory();

	const { user, setUser } = useUserContext()

	// const [currentPage, setCurrentPage] = useState(useLocation().pathname);

	const [profileImage, setProfileImage] = useState({
		image: localStorage.getItem('profileImageBase64') || null,
		type: localStorage.getItem('profileImageType') || null,
	});

	useEffect(() => {
		if (!localStorage.getItem('profileImageBase64')) {
			fetch('/api/user/image', {
				method: 'GET'
			})
				.then(data => data.json())
				.then(res => {
					localStorage.setItem("profileImageBase64", res.data);
					localStorage.setItem("profileImageType", res.type);
					setProfileImage({
						...profileImage,
						image: res.data,
						type: res.type
					})
				})
				.catch(err => {
					console.log(err.message);
				})
		}
	}, []);

	const navItems = [
		{
			title: "Explore",
			path: "/explore",
			key: "explore"
		}
	]

	const handleLogout = (e) => {
		logout()
			.then(() => {
				setUser({
					...user,
					authorized: false
				});
				history.push('/');
			})
			.catch(err => {
				console.log(err.message)
			})
	}

	const toggle = page => {
		if (currentPage !== page) setCurrentPage(page);
	}
	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-dark">
			<Link to="/" className="navbar-brand" >
				<img src={logo} width="32px" alt="logo" />
			</Link>
			<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<span className="navbar-toggler-icon"></span>
			</button>

			{/* Display under md */}

			{/* Navbar Collapse */}
			<div className="collapse navbar-collapse" id="navbarSupportedContent">
				<ul className="navbar-nav mr-auto">
					{navItems.map(navItem => (
						<li className="nav-item" key={navItem.key}>
							<Link
								to={navItem.path}
								className="text-light nav-link"
							// onClick={() => toggle(navItem.path)}
							>
								{navItem.title}
							</Link>
						</li>
					))}
				</ul>
			</div>
			<SearchBar />
			<Requests className="d-none d-md-block" />
			<div className="dropdown d-none d-md-block">
				<a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					<img width="10px" height="10px" src={`data:${profileImage.type};base64,${profileImage.image}`} />
				</a>
				<div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
					<Link to={'/user/' + user._id} className="dropdown-item">Profile</Link>
					<div className="dropdown-divider"></div>
					<a className="dropdown-item text-danger" onClick={handleLogout}>Logout</a>
				</div>
			</div>
		</nav>
	)
}

export default DashNav;
