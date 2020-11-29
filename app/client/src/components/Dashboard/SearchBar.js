import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'

const SearchBar = (props) => {
	const history = useHistory()
	const [searchText, setSearchText] = useState('')
	const [searchResult, setSearchResult] = useState([]);

	useEffect(() => {

	}, [searchResult])


	const handleSearch = (e) => {
		e.preventDefault();
		if (searchText !== '') {
			fetch(`/api/user/search?text=${searchText}`)
				.then(res => res.json())
				.then(res => {
					if (res.ok) {
						setSearchResult(res.doc);
					}
				})
		}
	}
	const handleChange = (e) => {
		setSearchText(e.target.value);
	}
	const toUser = (e, id) => {
		e.preventDefault();
		setSearchResult([]);
		setSearchText([]);
		history.push("/user/" + id);
	}

	const style = {
		position: "absolute",
		top: "100%",
		zIndex: 3
	}
	return (
		<form className="form-inline">
			<div className="input-group" onSubmit={handleSearch}>
				<label className="sr-only" htmlFor="navSearchBar">Search</label>
				<input name="search" className="form-control rounded-left" id="navSearchBar" type="text" placeholder="Search" onChange={handleChange} value={searchText} />
				<button className="btn btn-primary input-group-append" onClick={handleSearch}>Search</button>
			</div>
			<div style={style} className="list-group">
				{searchResult.map(doc => (
					<a href="" className="list-group-item list-group-item-action" onClick={(e) => toUser(e, doc._id)}>
						{doc.firstname + " " + doc.lastname}
					</a>
				))}
			</div>
		</form>
	)
}

export default SearchBar;