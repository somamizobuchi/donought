import React from 'react'
import './Toggle.css'

const Toggle = (props) => {

	return (
		<>
			<input name={props.name} type="checkbox" id="toggle" value={props.value} checked={props.checked} onChange={props.onChange} />
			<label htmlFor="toggle">Toggle</label>
		</>
	)
}

export default Toggle;