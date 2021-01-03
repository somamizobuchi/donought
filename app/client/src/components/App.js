import React, { useState, useEffect } from 'react';
import UserProvider, { useUserContext } from '../contexts/UserContext';
import PageLayout from './PageLayout'
import { BrowserRouter as Router } from 'react-router-dom';
import '../css/style.css'

export default function App() {
	// Render
	return (
		<div className="bg-dark">
			<UserProvider>
				<Router>
					<PageLayout />
				</Router>
			</UserProvider>
		</div>
	)
}
