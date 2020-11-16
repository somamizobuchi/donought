import React from 'react'
export default function Loading(props) {
	return (
		<div className="container py-5 m-auto text-center">
			<div className="spinner-border" role="status">
				<span className="sr-only">Loading...</span>
			</div>
		</div>
	)
}