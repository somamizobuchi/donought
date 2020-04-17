import React, { useContext } from 'react'
import { UserContext } from '../UserContext'
import Tasks from './Tasks'

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
            <Tasks />
            <button onClick={logout}>Logout</button>
        </div>
    );
}