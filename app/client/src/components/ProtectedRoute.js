import React from 'react'
import { useUserContext } from '../contexts/UserContext'

export default function ProtectedRoute({ Component, Fallback }) {
	const { user, setUser } = useUserContext();
	return user.authorized ? (
		<Component />
	) : (
			<Fallback />
		)
}