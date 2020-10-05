import React,{useState} from 'react';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup'
import AuthGuard from './components/AuthGuard'
import Home from './components/Home'

function App() {
  const [username,setUsername] = useState('')
// const userContext = React.createContext(username);
  const [profile, setProfile] = useState("");
  const userInfo = (obj) =>{
    console.log(obj)
    setUsername(obj.username)
    setProfile(obj.profile)
    return
  }
  return (
      <div className="App">
        <Router>
          <Switch>
            <Route
              exact
              path="/"
              component={(props) => (
                <Login
                  name="hk"
                  userInfo={(e) => {
                    userInfo(e);
                  }}
                  {...props}
                />
              )}
            />
            <Route exact path="/signup" component={(props)=>(
              <Signup
                userInfo={(e) => {
                  userInfo(e);
                }}
                {...props}
              />
            )} 
            />
            <AuthGuard
              // exact
              path="/home"
              component={(props) => (
                <Home username={username} profile={profile} {...props} />
              )}
            />
          </Switch>
        </Router>
      </div>
  );
}

export default App;
