import React from 'react'
import {Navbar, Nav, NavItem, NavLink, Button} from 'reactstrap'
// import { Link } from 'react-router-dom'

export default function DashNav(){
    return(
        <Navbar color="light">
            <Nav>
                <NavItem>
                    <NavLink>Hello</NavLink>
                </NavItem>
            </Nav>
        </Navbar>
    )
}