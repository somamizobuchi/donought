import React, { useState, useEffect } from 'react'
import './Toggle.scss'

const Toggle = ({ name, checked, value, onChange }) => {


	useEffect(() => {
	}, [])


	return (
		<input name={name} type="checkbox" id="toggle" checked={checked} value={value} onChange={onChange} />
	)
}

export default Toggle;