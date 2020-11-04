import React from "react";
import decode from "jwt-decode";
import { withRouter } from "react-router-dom";

// Context for all Auth functions
const AuthContext = React.createContext();

// React Provider as a component
class AuthProv extends React.Component {
  constructor() {
    super();

    // Default field data for logging in
    this.state = {
      stayLoggedIn: false,
      password: "",
      email: "",
      error: false,
    };

    // Bind all the auth related functions
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.isLoggedIn = this.isLoggedIn.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.toggleStayLoggedIn = this.toggleStayLoggedIn.bind(this);
    this.getToken = this.getToken.bind(this);
    this.getError = this.getError.bind(this);
  }

  // Used to alter password field in state
  setPassword(password) {
    this.setState({
      password: password,
    });
  }

  // Used to alter email field in state
  setEmail(email) {
    this.setState({
      email: email,
    });
  }

  // Used to alter stayloggedin field in state
  toggleStayLoggedIn() {
    this.setState((prevState) => ({
      stayLoggedIn: prevState.stayLoggedIn === false ? true : false,
    }));
  }

  // Used to check if the user is logged in
  isLoggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Used to check if the token has expired or not
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }

  // Used to return an error for the consumers to use
  getError() {
    return this.state.error;
  }

  // Used to log the user in
  async login() {
    let email = this.state.email;
    let password = this.state.password;

    // Posts the login request and parses the response to extract token then redirects user to /stocks page
    await fetch("http://localhost:3000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((result) => {
        return result.json();
      })
      .then((json) => {
        if (json.error) {
          this.setState({
            error: json.message,
          });
        } else {
          this.setToken(json.token);
          this.props.history.push("/stocks");
        }
      })
      .catch((e) => {
        console.log("Error with authentication: ", e);
      });
  }

  // Used to save token into a location for usage across pages
  setToken(token) {
    if (this.state.stayLoggedIn) {
      localStorage.setItem("token", token);
    } else {
      sessionStorage.setItem("token", token);
    }
  }

  // Used to retrieve token from location for usage across pages
  getToken() {
    let token = localStorage.getItem("token");
    if (token == null) {
      return sessionStorage.getItem("token");
    } else {
      return token;
    }
  }

  // Logs the user out by deleting the token
  logout() {
    let token = localStorage.getItem("token");
    if (token == null) {
      sessionStorage.removeItem("token");
    } else {
      localStorage.removeItem("token");
    }
    this.props.history.push("/login");
  }

  // The Auth provider component and all its pass down values
  render() {
    return (
      <AuthContext.Provider
        value={{
          isLoggedIn: this.isLoggedIn,
          setEmail: this.setEmail,
          setPassword: this.setPassword,
          toggleStayLoggedIn: this.toggleStayLoggedIn,
          login: this.login,
          logout: this.logout,
          token: this.getToken,
          getError: this.getError,
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

// Export Consumer and Provider, wrapping provider in router to allow redirects
const AuthConsumer = AuthContext.Consumer;
const AuthProvider = withRouter(AuthProv);
export { AuthProvider, AuthConsumer };
