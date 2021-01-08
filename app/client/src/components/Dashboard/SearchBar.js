import React, { useState, useEffect } from 'react'
import { FiX } from 'react-icons/fi'
import { Link, useHistory } from 'react-router-dom'

const SearchBar = ({ open, setOpen }) => {

	const history = useHistory()
	const [searchText, setSearchText] = useState('')
	const [searchResult, setSearchResult] = useState([]);
	const [cursor, setCursor] = useState(0);
	const [isOpen, setIsOpen] = useState(null);

	useEffect(() => {
		setIsOpen(open)
	}, [searchResult, open])

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

	const handleClose = (e) => {
		e.preventDefault();
		setIsOpen(false)
		setOpen(false);
	}

	return (
		<form className={"search-bar " + (isOpen ? "search-bar-show" : null)} onSubmit={handleSearch}>
			<div className={"form-group container search-bar-input" + (isOpen ? " slide-down" : " slide-up")}>
				<label className="d-none" htmlFor="navSearchBar">Search</label>
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
				<button className="btn bg-primary" onClick={handleClose}>Cancel</button>
			</div>
			<div className="search-results">
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