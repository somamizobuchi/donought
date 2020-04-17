import React from 'react'
import { Navbar, NavbarBrand, Nav, NavItem, NavLink} from 'reactstrap'
import logo from '../logo.png'
import { Link } from 'react-router-dom'

export default function HomeNav(){
    return(
        <div>
            <Navbar color="light">
                <NavbarBrand href="/">
                    <img src={logo} width="32px" alt=""/>
                    Donought
                </NavbarBrand>
                <Nav>
                    <NavItem>
                        <NavLink>
                            <Link to="/login">Login</Link>
                        </NavLink>
                    </NavItem>
                </Nav>
            </Navbar>
        </div>
    )
}