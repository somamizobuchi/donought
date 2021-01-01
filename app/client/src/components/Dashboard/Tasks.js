import loadable from "@loadable/component";
import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'



export default function Tasks() {

	const TaskTable = loadable(() => import('./TaskTable'));

	// loading state
	const [loading, setLoading] = useState(true);

	// Before component render: 
	useEffect(() => {
	}, [])

	// If user has tasks
	return (
		<TaskTable />
	)
}
