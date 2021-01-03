import loadable from "@loadable/component";
import React, { useEffect, useState } from "react";


export default function Tasks() {

	const TaskTable = loadable(() => import('./TaskTable'));

	// If user has tasks
	return (
		<>
			<TaskTable />
		</>
	)
}
