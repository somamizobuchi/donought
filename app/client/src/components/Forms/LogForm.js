import React, { useState, useEffect } from 'react'
import Toggle from '../Widgets/Toggle'
import { log_task } from '../../utils/task_utils'

export default function LogForm({ tid, success }) {

	const [form, setForm] = useState({
		tid: null,
		success: false,
		comment: ""
	});

	useEffect(() => {
		setForm({
			tid: tid,
			success: success,
			comment: ""
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

	return (
		<form className="log-form" onSubmit={handleLog}>
			<div className="form-group align-middle">
				<p><strong>Status:</strong> {success ? "Completed" : "Incomplete"}</p>
				<Toggle name="success" initial={success} state={form} setState={setForm} />
			</div>
			<div className="form-group">
				<input className="form-control" name="comment" type="text" value={form.comment} onChange={updateForm} placeholder="Anything to say?" />
			</div>
			<div className="form-group">
				<button className="btn" type="submit" disabled>Submit</button>
			</div>
		</form>
	)
}