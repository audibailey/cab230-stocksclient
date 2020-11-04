import React from 'react';
import Form from 'react-bootstrap/Form';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';

// Login form component
class LoginForm extends React.Component {
  constructor() {
    super();

    // Default field data for registering
    this.state = {
      email: false,
      password: false,
      invalidEmail: false,
      invalidPassword: false,
    }

    this.notEmpty = this.notEmpty.bind(this)
  }

  // Data validation for the fields
  notEmpty() {
    if (!this.state.email || !this.state.password) {
      if (!this.state.email) {
        this.setState(({
          invalidEmail: true,
        }))
      }
      if (!this.state.password) {
        this.setState(({
          invalidPassword: true,
        }))
      }
      return false
    } else {
      return true
    }
  }

  render() {
    return (
        <Jumbotron>
          <Form>
            <Form.Group>
              <Form.Label>Email address</Form.Label>
              <Form.Control type="text" placeholder="Enter Email" name="email" onChange={e => {
                // More data validation
                let regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (e.target.value !== '' && e.target.value.match(regex)) {
                  this.props.setEmail(e.target.value);
                  this.setState(({
                    email: true,
                    invalidEmail: false
                  }))
                } else {
                  this.setState(({
                    email: false,
                    invalidEmail: true
                  }))
                }
              }} isInvalid={this.state.invalidEmail}/>
            </Form.Group>

            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" name="password" onChange={e => {
                // More data validation
                if (e.target.value !== '') {
                  this.props.setPassword(e.target.value);
                  this.setState(({
                    password: true,
                    invalidPassword: false
                  }))
                } else {
                  this.setState(({
                    password: false,
                    invalidPassword: true
                  }))
                }
              }} isInvalid={this.state.invalidPassword}/>
            </Form.Group>

            <Form.Group>
              <Form.Check
                  label="Stay Logged In?"
                  onClick={this.props.toggleStayLoggedIn}
              />
            </Form.Group>
            <Button variant="primary" value="SUBMIT" onClick={() => {
              // Data validation then send
              if (this.notEmpty()) {
                this.props.login()
              }
            }}>
              Login
            </Button>
          </Form>
        </Jumbotron>
    )
  }
}

export default LoginForm;