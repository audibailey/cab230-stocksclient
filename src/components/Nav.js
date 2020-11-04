import React from 'react'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { AuthConsumer } from './Auth';

// Nav bar component as a function
export default () => (
    // Auth consumer to determine if user is logged in, and ability to log them out
    <AuthConsumer>
      {({ isLoggedIn, logout }) => (
        <Navbar bg="dark" expand="lg" variant="dark" sticky="top">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href={'/'}>Home</Nav.Link>
              <Nav.Link href={'/stocks'}>Stocks</Nav.Link>
            </Nav>
            <Nav>
              { isLoggedIn() ?
                (
                  <Nav.Link onClick={logout}>Logout</Nav.Link>
                ) : (
                  <React.Fragment>
                    <Nav.Link href={'/login'}>Login</Nav.Link>
                    <Nav.Link href={'/register'}>Register</Nav.Link>
                  </React.Fragment>
                )
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      )}
    </AuthConsumer>
)