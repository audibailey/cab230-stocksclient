import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { AuthProvider } from './components/Auth';
import Nav from './components/Nav';
import Home from './routes/Home';
import Login from './routes/Login';
import Register from './routes/Register';
import Stocks from './routes/Stocks';
import Quote from './routes/Quote';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Fade from 'react-bootstrap/Fade';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// 404 route as a function, simple jumbotron with a home link and some minimal info
const NotFound = ({ location }) => (
    <Fade mountOnEnter={true} appear={true} in={true}>
      <div className={'container d-flex h-100'}>
        <div className={'row align-self-center w-100'}>
          <div className="col-6 mx-auto">
            <Jumbotron>
              <h1>ERROR 404: Not Found</h1>
              <p>
                Location: <code>{location.pathname}</code> invalid. Go home? <Link to={"/"} >Yes please!</Link>
              </p>
            </Jumbotron>
          </div>
        </div>
      </div>
    </Fade>
)

function App() {
  // Auth provider is rendered here
  return (
      <Router>
        <AuthProvider>
          <div className={'min-vh-100'}>
            <Nav />
            <div className={"App-maxheight"}>
              <div className={'backgroundImg'}></div>
              <Switch>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route exact path="/login">
                    <Login />
                </Route>
                <Route exact path="/stocks">
                  <Stocks />
                </Route>
                <Route exact path="/register">
                  <Register />
                </Route>
                <Route path={`/quote/:symbol`} component={Quote}/>
                <Route exact path="/quote">
                  <Quote />
                </Route>
                <Route component={NotFound} />
              </Switch>
            </div>
          </div>
        </AuthProvider>
      </Router>
  );
}

export default App;
