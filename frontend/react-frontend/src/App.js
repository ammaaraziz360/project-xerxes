import LoginPage from "./components/LoginPage";

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
      <Router>
        <Switch>
          <Route path='/' component={LoginPage}></Route>
          <Route path='/home' component={LoginPage}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
