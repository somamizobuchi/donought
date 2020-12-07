import React from 'react'
<<<<<<< HEAD
import { Navbar, Nav, NavLink } from 'reactstrap'
=======
>>>>>>> myTaskCardRemake
import { Link } from 'react-router-dom'


export default function Footer() {
    return (
        <div>
<<<<<<< HEAD
            <Link to='/about'>About</Link>
=======
            <div className="navbar bg-dark">
                <div className="container">
                    <Link to="/about">About</Link>
                </div>
            </div>
>>>>>>> myTaskCardRemake
            <div>
                <p className="text-center">&copy; 2020 Soma Mizobuchi</p>
            </div>
        </div>
    )
}