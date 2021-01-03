import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'

const SearchBar = (props) => {
	const history = useHistory()
	const [searchText, setSearchText] = useState('')
	const [searchResult, setSearchResult] = useState([]);
	const [cursor, setCursor] = useState(0);

	useEffect(() => {

	}, [searchResult])

	const handleKeyPress = (e) => {
		if (e.keyCode === 38 & cursor > 0) {
			e.preventDefault();
			setCursor(cursor - 1);
		} else if (e.keyCode === 40 & cursor < searchResult.length) {
			e.preventDefault();
			setCursor(cursor + 1);
		}
	}


	const handleSearch = (e) => {
		e.preventDefault();
		if (searchText !== '' && cursor === 0) {
			fetch(`/api/user/search?text=${searchText}`)
				.then(res => res.json())
				.then(res => {
					if (res.ok) {
						setSearchResult(res.doc);
					}
				})
		} else if (searchResult.length > 0 & cursor > 0) {
			setSearchResult([]);
			setSearchText('');
			setCursor(0);
			history.push('/user/' + searchResult[cursor - 1]._id);
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
		width: "100%",
		top: "100%",
		zIndex: 3
	}
	return (
		<form className="nav-search position-relative" onSubmit={handleSearch}>
			<label className="sr-only" htmlFor="navSearchBar">Search</label>
			<input
				name="search"
				className=""
				id="navSearchBar"
				type="text"
				placeholder="Search"
				onChange={handleChange}
				value={searchText}
				onKeyDown={handleKeyPress}
			/>
			<div style={style} className="search-results">
				{searchResult.map((doc, idx) => (
					<a key={"user-" + doc._id} className={cursor === idx + 1 ? "" : ""} onClick={(e) => toUser(e, doc._id)}>
						{doc.firstname + " " + doc.lastname}
					</a>
				))}
			</div>
		</form>
	)
}

export default SearchBar;