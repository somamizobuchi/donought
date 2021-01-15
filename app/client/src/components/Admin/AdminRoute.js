import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useUserContext } from '../../contexts/UserContext';

export default function AdminRoute({ path, component }) {
	const { currentUser } = useUserContext();
	console.log(currentUser)
	return (
		<>
			{ currentUser._role === 1 ? (<Route path={path} component={component} />) : (<Redirect to="/" />)}
		</>
	)
}
