import React from 'react';
import Fade from 'react-bootstrap/Fade';
import Alert from 'react-bootstrap/Alert';
import { withRouter, Redirect } from 'react-router-dom';
import { AuthConsumer } from './../components/Auth';
import LoginForm from './../components/LoginForm';

// Login page as a component
class Login extends React.Component {
  render() {
    return (
        // Animation for cleanliness
      <Fade mountOnEnter={true} appear={true} in={true}>
        <div className={'container d-flex h-100'}>
          <div className={'row align-self-center w-100'}>
            <div className="col-6 mx-auto">
              <h1 className="h3 mb-3 font-weight-normal">Login</h1>
              {/* Uses the consumer */}
                <AuthConsumer>
                  {({ isLoggedIn, setEmail, setPassword, toggleStayLoggedIn, login, getError }) => {
                    // If logged in redirect home
                    if (isLoggedIn()) {
                      return <Redirect to={"/"} />
                    } else if (getError()) {
                      // Display error above form when error occurs
                      return (
                          <React.Fragment>
                            <Alert variant="danger">
                              <p>{getError()}. Try again.</p>
                            </Alert>
                            <LoginForm
                                setEmail={setEmail}
                                setPassword={setPassword}
                                toggleStayLoggedIn={toggleStayLoggedIn}
                                login={login} />
                          </React.Fragment>
                          )
                    } else {
                      // Login form
                      return <LoginForm
                          setEmail={setEmail}
                          setPassword={setPassword}
                          toggleStayLoggedIn={toggleStayLoggedIn}
                          login={login} />
                    }
                  }}
                </AuthConsumer>
            </div>
          </div>
        </div>
      </Fade>
    )
  }
}

// Export with router redirects
export default withRouter(Login);