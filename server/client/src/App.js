import React, {useState, useEffect} from 'react';
import Home from './components/Home'
import 'bootstrap/dist/css/bootstrap.min.css';
import {UserProvider} from './UserContext';
import Dashboard from './components/Dashboard';

function App() {
  
  const [user, setUser] = useState({
    _id: '',
    email: '',
    authorized: false,
    tasks: ''
  });

  const authorize = async () => {
    fetch('/api/user/isauth')
      .then(res => res.json())
      .then(res => setUser({ 
        _id: res._id,
        email: res.email,
        authorized: res.ok
      }))
      .catch(err => {
        console.log(err.message)
      })
  }

  useEffect(() => {
    authorize()
  },[user.authorized])


    return ( 
      <div className="App">
        <UserProvider value={{user, setUser}}>
          {user.authorized ? (<Dashboard />) : (<Home />)}
        </UserProvider>
      </div>
    )


}

export default App;
