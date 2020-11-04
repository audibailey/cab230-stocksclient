import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Fade from 'react-bootstrap/Fade';
import Alert from 'react-bootstrap/Alert';
import Jumbotron from 'react-bootstrap/Jumbotron';
import { withRouter } from 'react-router-dom';

// Register page as a component
class Register extends React.Component {
  constructor() {
    super()

    // Default field data for registering
    this.state = {
      password: "",
      email: "",
      error: false,
      invalidEmail: false,
      invalidPassword: false,
    }

    // Bind all the register related functions
    this.setEmail = this.setEmail.bind(this)
    this.setPassword = this.setPassword.bind(this)
    this.register = this.register.bind(this)
  }

  // Used to alter password field in state
  setPassword(password) {
    this.setState(({
      password: password
    }))
  };

  // Used to alter email field in state
  setEmail(email) {
    this.setState(({
      email: email
    }))
  };

  // Used to log the register the user and send them to login on success
  async register() {
    let email = this.state.email
    let password = this.state.password

    // Data validation
    if (this.state.email === "" || this.state.password === "") {
      if (this.state.email === "") {
        this.setState(({
          invalidEmail: true,
        }))
      }
      if (this.state.password === "") {
        this.setState(({
          invalidPassword: true,
        }))
      }
    } else {
      await fetch("http://localhost:3000/user/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      }).then(result => {
        return result.json()
      }).then(json => {
        if (json.error) {
          this.setState({
            error: json.message
          })
        } else {
          this.props.history.push('/login')
        }
      }).catch(e => {
        console.log("Error with registering: ", e)
      });
    }
  }

  render() {
    // Animation for cleanliness
    return (
        <Fade mountOnEnter={true} appear={true} in={true}>
          <div className={'container d-flex h-100'}>
            <div className={'row align-self-center w-100'}>
              <div className="col-6 mx-auto">
                <h1 className="h3 mb-3 font-weight-normal">Register</h1>
                { /* Display an error if there is one */
                    this.state.error &&
                      <Alert variant="danger">
                        <p>{this.state.error} Try again!</p>
                      </Alert>
                }
                <Jumbotron>
                <Form>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" onChange={e => {
                      // More data validation
                        let regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                        if (e.target.value !== '' && e.target.value.match(regex)) {
                          this.setEmail(e.target.value)
                          this.setState(({
                              invalidEmail: false
                          }))
                        } else {
                          this.setState(({
                            invalidEmail: true
                          }))
                        }
                    }} isInvalid={this.state.invalidEmail}/>
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={e => {
                      // More data validation
                      if (e.target.value !== '') {
                        this.setPassword(e.target.value)
                        this.setState(({
                          invalidPassword: false
                        }))
                      } else {
                        this.setState(({
                          invalidPassword: true
                        }))
                      }
                    }} isInvalid={this.state.invalidPassword}/>
                  </Form.Group>
                  <Button variant="primary" onClick={this.register}>
                    Register
                  </Button>
                </Form>
                </Jumbotron>
              </div>
            </div>
          </div>
        </Fade>
    )
  }
}
// Export with router redirects
export default withRouter(Register);