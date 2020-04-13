import React, {useState, useEffect} from 'react';
import Home from './components/Home'
import 'bootstrap/dist/css/bootstrap.min.css';

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
      .then(res => {
        if(res.success){
          setIsAuth(false);
        }
      })
  }

  if(isAuth){
    return(
      <button onClick={() => logout()}>Logout</button>
    )
  }else{
    return (
      <div className="App">
        <Home isAuth={isAuth}/>
      </div>
    )
  }

  
}

export default App;
