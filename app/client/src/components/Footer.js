import React from 'react'
import { Navbar, Nav, NavLink} from 'reactstrap'


export default function Footer(){
    return(
        <div>
            <Navbar color="light">
                <Nav>
                    <NavLink>About</NavLink>
                </Nav>
            </Navbar>
            <div>
                <p className="text-center">&copy; 2020 Soma Mizobuchi</p>
            </div>
        </div>
    )
}