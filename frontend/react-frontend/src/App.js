import { useEffect, useState} from "react";
import Cookies from 'universal-cookie'

import LoginPage from "./components/LoginPage";
import ProfilePage from "./components/ProfilePage";
import NotFoundPage from "./components/404Page";
import NavBar from "./components/NavBar";
import PostPage from "./components/PostPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import FollowersFollowingPage from "./components/FollowersFollowingPage";
import CategoryHomePage from "./components/CategoryComponents/CategoryHomePage";
import CategoryPage from "./components/CategoryComponents/CategoryPage";
import CCRPage from "./components/CategoryComponents/CategoryCreationRequest";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import './App.css';
import { LoggedInContext } from "./components/LoggedInContext";
import SideBar from "./components/SideBar";

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
          <div className="container-fluid">
            <div className="row">     
              <div className="d-flex col-2 justify-content-lg-center above">
                <SideBar/>
              </div>
              <div className="col-md-8 col-sm-12">
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
                  <Route exact path='/category/home'>
                    <CategoryHomePage/>
                  </Route>
                  <Route exact path='/category/:category_name'>
                    <CategoryPage/> 
                  </Route>
                  <Route exact path='/category/:category_id/ccr-request'>
                    <CCRPage/>
                  </Route>
                  <Route path='/404'>
                    <NotFoundPage />
                  </Route>
                  <Route path='*' >
                    <Redirect to="/login"/>
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
