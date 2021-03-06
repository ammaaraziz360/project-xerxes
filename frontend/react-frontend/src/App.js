import { useEffect, useState} from "react";
import Cookies from 'universal-cookie'

import LoginPage from "./components/LoginPage";
import ProfilePage from "./components/ProfilePage";
import NotFoundPage from "./components/404Page";
import NavBar from "./components/NavBar";
import PostPage from "./components/PostPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import FollowersFollowingPage from "./components/FollowersFollowingPage";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import { LoggedInContext } from "./components/LoggedInContext";

const cookie = new Cookies();

function App() {
  if(localStorage.getItem("logged_in") === null) {
    localStorage.setItem("logged_in", "false");
  }

  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("logged_in") === "true" ? true : false);

  return (
    <div className="App">
      <LoggedInContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
        <Router>
          <NavBar/>
          <div className="container">
            <div className="row">
              <div className="col-2">
              </div>
              <div className="col-md-8 col-xs-12">
                <Switch>
                  <Route exact path='/login' >
                    <LoginPage/>
                  </Route>
                  <Route exact path='/user/:username'>
                    <ProfilePage/>
                  </Route>
                  <Route path='/post/:id'>
                    <PostPage />
                  </Route> 
                  <Route exact path='/user/:username/following'>
                    <FollowersFollowingPage type="following"/>
                  </Route>
                  <Route exact path='/user/:username/followers'>
                    <FollowersFollowingPage type="followers"/>
                  </Route>
                  <Route path='/404'>
                    <NotFoundPage />
                  </Route>
                  <Route path='*' >
                    <NotFoundPage/>
                  </Route>
                </Switch>
              </div>
            </div>
          </div>
        </Router>
      </LoggedInContext.Provider>
    </div>
  );
}

export default App;
