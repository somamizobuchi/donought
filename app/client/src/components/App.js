import React, { useState, useEffect } from 'react';
import UserProvider, { useUserContext } from '../contexts/UserContext';
import LandingPage from './LandingPage'
import { BrowserRouter as Router } from 'react-router-dom';
import '../css/style.css'

export default function App() {
	// Render
	return (
		<div className="bg-dark">
			<UserProvider>
				<Router>
					<LandingPage />
				</Router>
			</UserProvider>
		</div>
	)
}
