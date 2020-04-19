import React, { useContext } from 'react'
import { UserContext } from '../../UserContext'
import Tasks from './Tasks'
import DashNav from './DashNav'
import { Button } from 'reactstrap'

export default function Dashboard(){

    var {user, setUser} = useContext(UserContext);

    const logout = (e) => {
        fetch('/api/user/logout')
            .then(res => res.json())
            .then(res => setUser({
                authorized: false
            }))
    }
    
    return(
        <div>
            <DashNav />
            <Tasks />
            <Button onClick={logout}>Logout</Button>
        </div>
    );
}