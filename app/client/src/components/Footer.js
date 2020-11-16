import React from 'react'
import { Navbar, Nav, NavLink } from 'reactstrap'
import { Link } from 'react-router-dom'


export default function Footer() {
    return (
        <div>
            <Link to='/about'>About</Link>
            <div>
                <p className="text-center">&copy; 2020 Soma Mizobuchi</p>
            </div>
        </div>
    )
}