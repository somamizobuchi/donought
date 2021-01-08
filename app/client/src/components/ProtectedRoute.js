import React from 'react'
import { useUserContext } from '../contexts/UserContext'
import { Redirect } from 'react-router-dom'

export default function ProtectedRoute({ Component, Fallback }) {
	const { currentUser } = useUserContext();
	return currentUser.authorized ? (
		<Component />
	) : (
			<Redirect to="/" />
		)
}