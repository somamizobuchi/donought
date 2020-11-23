import React from 'react'
import { Link } from 'react-router-dom'


export default function Footer() {
    return (
        <div>
            <div className="navbar bg-dark">
                <div className="container">
                    <Link to="/about">About</Link>
                </div>
            </div>
            <div>
                <p className="text-center">&copy; 2020 Soma Mizobuchi</p>
            </div>
        </div>
    )
}