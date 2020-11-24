import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const SearchBar = (props) => {
	const [searchText, setSearchText] = useState('')
	const [searchResult, setSearchResult] = useState([]);
	const handleSearch = (e) => {
		e.preventDefault();
		fetch(`/api/user/search?text=${searchText}`)
			.then(res => res.json())
			.then(res => {
				if (res.ok) {
					setSearchResult(res.doc);
				}
			})
	}
	const handleChange = (e) => {
		setSearchText(e.target.value);
	}

	const style = {
		position: "absolute",
		top: "100%",
		width: "256px",
		color: "black",
		zIndex: 3,
		backgroundColor: "#fff",
		borderRadius: "5px"
	}
	return (
		<div className="form-inline">
			<label className="sr-only" htmlFor="search">Search</label>
			<input name="search" className="form-control" type="text" placeholder="Search" onChange={handleChange} value={searchText} />
			<button className="btn btn-primary" onClick={handleSearch}>Search</button>
			<div style={style}>
				{searchResult.map(doc => (
					<Link to={"/user/" + doc._id}>
						<p>{doc.firstname}</p>
					</Link>
				))}
			</div>
		</div>
	)
}

export default SearchBar;