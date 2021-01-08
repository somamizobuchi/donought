import React, { useState, useEffect } from 'react'
import Toggle from '../Widgets/Toggle'
import { log_task } from '../../utils/task_utils'

export default function LogForm({ tid }) {

	const [form, setForm] = useState({
		tid: tid,
		success: false,
		comment: ""
	});

	useEffect(() => {
		setForm({
			...form,
			tid: tid
		})
	}, [tid])

	const updateForm = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value
		})
	}

	const handleLog = (e) => {
		e.preventDefault();
		log_task(form)
			.then(() => {
				console.log("hello");
			})
			.catch(err => {
				console.log(err);
			})
	}
	const handleToggle = (e) => {
		setForm({
			...form,
			success: !form.success
		})
	}

	return (
		<form className="log-form" onSubmit={handleLog}>
			<div className="form-group align-middle">
				<p><strong>Status:</strong> {form.success ? "Completed" : "Incomplete"}</p>
				<label htmlFor="toggle">Toggle</label>
				<Toggle name="success" checked={form.success} value={form.success} onChange={handleToggle} />
			</div>
			<div className="form-group">
				<input className="form-control" name="comment" type="text" value={form.comment} onChange={updateForm} placeholder="Anything to say?" />
			</div>
			<div className="form-group">
				<button className="btn bg-primary" type="submit">Submit</button>
			</div>
		</form>
	)
}