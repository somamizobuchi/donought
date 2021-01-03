import React, { useState, useEffect } from 'react'
import { FiX } from 'react-icons/fi'

export function Modal({ open, setOpen, children }) {

	const handleToggle = (e) => {
		setOpen(false);
	}

	return (
		<div className={"modal-bg " + (open ? "" : "d-none")} onClick={handleToggle}>
			<div className="modal-content rounded position-relative" onClick={e => e.stopPropagation()}>
				<div className="modal-toggle" onClick={handleToggle}>
					<FiX className="btn-round" />
				</div>
				{children}
			</div>
		</div>
	)
}
export function ModalTitle({ children }) {
	return (
		<div className="modal-title">
			<h3>
				{children}
			</h3>
		</div>
	)
}
export function ModalBody({ children }) {
	return (
		<div className="modal-body">
			{children}
		</div>
	)
}

export function ModalFooter({ children }) {
	return (
		<div className="modal-footer">
			{children}
		</div>
	)
}