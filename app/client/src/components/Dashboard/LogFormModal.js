import React, { useEffect, useState } from 'react'
import Toggle from '../Widgets/Toggle'
import { log_task } from '../../utils/task_utils'

// Log Form in a Modal
const LogFormModal = (props) => {


	// Use Effect
	useEffect(() => {
		setForm({
			tid: props.tid,
			success: false,
			comment: ''
		})
	}, [props.tid])

	// Form State
	const [form, setForm] = useState({
		tid: null,
		comment: '',
		success: false
	})

	// Update Form
	const updateForm = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value
		})
	}

	// Handle Logging
	const handleLog = (e) => {
		// prevent default behavior
		e.preventDefault();
		// Log the task
		log_task(form)
			.then(() => {
				$("#logFormModal").modal("hide");
				// setRefresh(!refresh);
			})
			.catch(err => {
				$("#logFormModal").modal("hide");
				// setRefresh(!refresh);
			})
	}

	const updateToggle = () => {
		setForm({
			...form,
			success: !form.success
		});
	}

	// Render Modal
	return (
		<div className="modal fade" id="logFormModal" aria-labelledby="logFormModal" tabIndex="-1" role="dialog">
			<div className="modal-dialog" role="document">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">How did you do today?</h5>
						<button type="button" className="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div className="modal-body">
						<form>
							<div className="form-group align-middle">
								<Toggle name="success" value={form.success} onChange={updateToggle} checked={form.success} />
								{form.success ? ("I didn't :)") : ("I did :(")}
							</div>
							<div className="form-group">
								<input className="form-control" name="comment" type="text" value={form.comment} onChange={updateForm} placeholder="Anything to say?" />
							</div>
						</form>
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-primary" onClick={handleLog}>Sumbit</button>
						<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default LogFormModal;