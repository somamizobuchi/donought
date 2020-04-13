import React, { useContext } from 'react'
import { UserContext } from '../UserContext'

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
            <h1>{user._id}</h1>
            <button onClick={logout}>Logout</button>
        </div>
    );
}