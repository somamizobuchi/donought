import React, { useState } from 'react';

export default function UploadForm(props) {
	const [form, setForm] = useState({
		image: null
	});

	const handleChange = (e) => {
		setForm({
			image: e.target.files[0]
		})
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('image', form.image);
		const requestOptions = {
			method: 'POST',
			body: formData
		}
		fetch('/api/user/image', requestOptions)
			.then(res => {
				if (res.ok) {
					console.log("ok")
				}
			})
	}


	return (
		<form onSubmit={handleSubmit}>
			<div className="form-group">
				<label htmlFor="imageUpload">Upload Profile Image</label>
				<input type="file" name="image" className="form-control-file" id="imageUpload" onChange={handleChange} />
			</div>
			<button className="btn btn-primary" type="submit" >Submit</button>
		</form>
	)
}