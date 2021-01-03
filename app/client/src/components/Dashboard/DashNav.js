import React, { useState, useEffect } from 'react'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { useUserContext } from '../../contexts/UserContext'
import { logout } from '../../utils/user_utils'
import SearchBar from './SearchBar'
import logo from '../../logo.svg'
import Requests from './Requests'
import { FiMenu } from 'react-icons/fi'


const DashNav = (props) => {

	const history = useHistory();

	const { user, setUser } = useUserContext()

	const [isOpen, setIsOpen] = useState(false);

	const [navCollapseClassNames, setNavCollapseClassNames] = useState("nav-collapse");

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

	const handleToggle = e => {
		e.preventDefault();
		if (isOpen) {
			setNavCollapseClassNames("nav-collapse nav-collapse-slide-out");
			setIsOpen(!isOpen)
		} else {
			setNavCollapseClassNames("nav-collapse nav-collapse-slide-in");
			setIsOpen(!isOpen);
		}
	}

	return (
		<nav className="nav-main bg-ui-dark position-relative">
			<div className="container d-flex-col">
				<div className="nav-controls">
					<div className="nav-logo col-1">
						<Link to="/">
							<img src={logo} alt="logo" />
						</Link>
					</div>
					<FiMenu className="align-self-center nav-toggle" onClick={handleToggle} />
				</div>
				<div className={navCollapseClassNames}>
					<span onClick={handleToggle}>X</span>
					<ul className="container">
						<li>
							<SearchBar />
						</li>
						{navItems.map(navItem => (
							<li key={navItem.key}>
								<Link
									to={navItem.path}
									className="text-light nav-link"
								>
									{navItem.title}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
		</nav>

	)
}
export default DashNav;