import React, { useContext } from 'react'
import logo from '../logo.svg'
import { Link } from 'react-router-dom'
import Loadable from 'react-loadable';
import { UserContext } from '../UserContext'

export default function MainNav(props) {

	const { user, setUser } = useContext(UserContext);

	// const [currentPage, setCurrentPage] = useState(useLocation().pathname);

	// const toggleActivePage = (page) => {
	// 	if (currentPage !== page) setCurrentPage(page);
	// }

	// Loading component
	const Loading = () => {
		return <></>
	}

	// Dynamic import
	const DashNav = Loadable({
		loader: () => import('./Dashboard/DashNav'),
		loading: Loading
	})

	const HomeNav = Loadable({
		loader: () => import('./HomeNav'),
		loading: Loading
	})

	let NavContent;
	if (user.authorized === true) {
		NavContent = <DashNav user={user} />
	} else if (user.authorized === false) {
		NavContent = <HomeNav />
	} else {
		NavContent = <HomeNav />
	}

	// Render
	return (
		<div className="navbar navbar-light bg-light" color="light">
			<div className="container">
				<Link to="/" className="navbar-brand" >
					<img src={logo} width="32px" alt="logo" />
				</Link>
				{NavContent}
			</div>
		</div>
	)
}