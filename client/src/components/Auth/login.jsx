import React, { Component, Fragment } from "react";
import * as userService from "../../services/user";
import { Redirect } from "react-router-dom";
import IndeterminateProgress from "../utilities/indeterminateProgress";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectToReferrer: false,
      email: "",
      password: "",
      feedbackMessage: "",
      checkingLogin: true
    };
  }

  componentDidMount() {
    //checking the token to see if it's ok
    userService.checkLogin().then(loggedIn => {
      if (loggedIn) {
        this.setState({ redirectToReferrer: true, checkingLogin: false });
      } else {
        this.setState({ checkingLogin: false });
      }
    });
  }

  login(e) {
    e.preventDefault(); //default is for the page to refresh (won't end up loggin in)
    userService
      .login(this.state.email, this.state.password)
      .then(() => {
        this.setState({ redirectToReferrer: true }); //causes render function to run again
      })
      .catch(err => {
        if (err.message) {
          this.setState({ feedbackMessage: err.message }); //triggers render again and shows error message
        }
      });
  }

  handleEmailChange(value) {
    this.setState({ email: value });
  }

  handlePasswordChange(value) {
    this.setState({ password: value });
  }

  render() {
    //from is either / or this.props.location.state (the page from which you were redirected)
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToReferrer, checkingLogin } = this.state;

    if (checkingLogin) {
      //indeterminate progress bar
      return <IndeterminateProgress message="checking login status..." />;
    }
    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <Fragment>
        <p>You must be logged in to view this page</p>
        <form onSubmit={(e) => this.login(e)}> 
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="form-control"
              type="email"
              onChange={e => this.handleEmailChange(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="form-control"
              type="password"
              onChange={e => this.handlePasswordChange(e.target.value)}
              required
            />
          </div>
          {this.state.feedbackMessage ? (
            <p>{this.state.feedbackMessage}</p>
          ) : null}
          <input type="submit" value="Login" className="btn btn-primary" />
        </form>
      </Fragment>
    );
  }
}

export default Login;
