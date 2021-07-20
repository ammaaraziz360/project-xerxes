import { useEffect, useState } from "react";
import Cookies from 'universal-cookie'

import LoginPage from "./components/LoginPage";
import ProfilePage from "./components/ProfilePage";
import NavBar from "./components/NavBar";
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';

const cookie = new Cookies();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggedInState, setIsLoggedInState] = useState(false);


  return (
    <div className="App">
      <Router>
        <NavBar isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                isLoggedInState={isLoggedInState}
                setIsLoggedInState = {setIsLoggedInState}/>
        <Switch>
          <Route path='/login' >
            <LoginPage isLoggedIn={isLoggedIn}
                        setIsLoggedIn={setIsLoggedIn}
                        isLoggedInState={isLoggedInState}
                        setIsLoggedInState={setIsLoggedInState}
                        />
          </Route>
          <Route path='/profile'>
            <ProfilePage
              isLoggedInState={isLoggedInState}
              setIsLoggedInState={setIsLoggedInState}
            />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
