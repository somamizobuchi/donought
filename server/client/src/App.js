import React, {useState, useEffect} from 'react';
import Home from './components/Home'
import 'bootstrap/dist/css/bootstrap.min.css';
import {UserProvider} from './UserContext'

function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    fetch('/api/user/isauth')
      .then(res => res.json())
      .then(res => setIsAuth(res.success))
  })

  const logout = () => {
    fetch('/api/user/logout')
      .then(res => res.json())
      .then(res => setIsAuth(false))
  }

  
  if(isAuth){
    return(
      <button onClick={() => logout()}></button>
    )
  }else{
    return (
      <UserProvider value={{isAuth: isAuth, setIsAuth: setIsAuth}}>
        <div className="App">
          <Home/>
        </div>
      </UserProvider>
    )
  }
  
}

export default App;
