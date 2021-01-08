import React from 'react'
import Footer from './Footer'
import {
	Link,
	Switch,
	Route
} from "react-router-dom";
import { BsCheck, BsCheckAll, BsCheckBox, BsPeopleFill, BsXSquare } from 'react-icons/bs'
import NotFound from './NotFound'
import HomeNav from './HomeNav'


export default function Home(props) {

	// Main Component
	return (
		<div>
			<HomeNav />
			<Switch>
				<Route path="/" exact component={HomeContent} />
				<Route path="*" component={NotFound} />
			</Switch>
			<Footer />
		</div >
	)
}

const HomeContent = (props) => {
	return (
		<main>
			<div className="hero">
				<div className="hero-text">
					<h1>Donought - (DO)<sub>0</sub></h1>
					<p>Do less, not more</p>
				</div>
			</div>
			<InfoCard />
		</main>
	)
}

const InfoCard = (props) => {
	return (
		<div className="info-card bg-ui-dark">
			<div className="container d-flex-col">
				<h2>
					What is Donought?
				</h2>
				<p>
					Donought is a simple app to help you keep track of unwanted habits.
				</p>
				<Link to="/about" className="btn bg-primary info-card-btn">
					Learn More
				</Link>
			</div>
		</div>
	)
}