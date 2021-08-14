import { useEffect, useState } from "react";
import Cookies from 'universal-cookie'

import LoginPage from "./components/LoginPage";
import ProfilePage from "./components/ProfilePage";
import NotFoundPage from "./components/404Page";
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
  
  return (
    <div className="App">
      <Router>
        <NavBar isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}/>
        <Switch>
          <Route path='/login' >
            <LoginPage isLoggedIn={isLoggedIn}
                        setIsLoggedIn={setIsLoggedIn}
            />
          </Route>
          <Route path='/user/:username'>
            <ProfilePage isLoggedIn={isLoggedIn}
                          setIsLoggedIn={setIsLoggedIn}
              />
          </Route>
          <Route path='/404'>
            <NotFoundPage />
          </Route>
          <Route path='*' >
            <NotFoundPage/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
