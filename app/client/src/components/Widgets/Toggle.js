import React, { useState, useEffect } from 'react'
import './Toggle.css'

const Toggle = (props) => {

	const [checked, setChecked] = useState(false);

	useEffect(() => {
		setChecked(props.initial)
	}, [props.initial])

	const handleToggle = (e) => {
		setChecked(!checked);
		props.setState({
			...props.state,
			[e.target.name]: e.target.checked
		})
	}
	return (
		<>
			<input name={props.name} type="checkbox" id="toggle" checked={checked} value={checked} onChange={handleToggle} />
			<label htmlFor="toggle">Toggle</label>
		</>
	)
}

export default Toggle;