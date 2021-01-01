import React, { useState, useEffect } from 'react';
import UserProvider, { useUserContext } from '../contexts/UserContext';
import PageLayout from './PageLayout'
import { BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'

export default function App() {
	// Render
	return (
		<div className="App bg-light">
			<UserProvider>
				<Router>
					<PageLayout />
				</Router>
			</UserProvider>
		</div>
	)
}
