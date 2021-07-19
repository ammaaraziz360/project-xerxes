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



function App() {
  return (
    <div className="App">
      <NavBar/>
      <Router>
        <Switch>
          <Route path='/login' component={LoginPage}></Route>
          <Route path='/profile' component={ProfilePage}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
