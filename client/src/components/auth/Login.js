import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
import { GoogleLogin } from 'react-google-login';
// refresh token
import { refreshTokenSetup } from './refreshToken';
const clientId ='546377929056-q4llvpv9kgej63aae3b67oi2hii14lea.apps.googleusercontent.com';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
    // console.log()
    // this.googleSDK();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }

    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password,
      google_login:false
    };

    this.props.loginUser(userData);
    // localStorage.setItem("google_login", 0);
  };

  // googleSDK() { 
  //   window['googleSDKLoaded'] = () => {
  //     window['gapi'].load('auth2', () => {
  //       this.auth2 = window['gapi'].auth2.init({
  //         client_id: '546377929056-q4llvpv9kgej63aae3b67oi2hii14lea.apps.googleusercontent.com',
  //         cookiepolicy: 'single_host_origin',
  //         scope: 'profile email'
  //       });
  //       this.prepareLoginButton();
  //     });
  //   }
  
  //   (function(d, s, id){
  //     var js, fjs = d.getElementsByTagName(s)[0];
  //     if (d.getElementById(id)) {return;}
  //     js = d.createElement(s); js.id = id;
  //     js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
  //     fjs.parentNode.insertBefore(js, fjs);
  //   }(document, 'script', 'google-jssdk'));
  
  // }

  // prepareLoginButton = () => { 
  //   console.log(this.refs.googleLoginBtn);
    
  //   this.auth2.attachClickHandler(this.refs.googleLoginBtn, {},
  //     (googleUser) => {
  
  //     let profile = googleUser.getBasicProfile();
  //     console.log('Token || ' + googleUser.getAuthResponse().id_token);
  //     console.log('ID: ' + profile.getId());
  //     console.log('Name: ' + profile.getName());
  //     console.log('Image URL: ' + profile.getImageUrl());
  //     console.log('Email: ' + profile.getEmail());
  //     //YOUR CODE HERE
  
  
  //     }, (error) => {
  //     alert(JSON.stringify(error, undefined, 2));
  //     });
  // }

  // onLogoutSucc = () => { 
  //   console.log('Logout Success');
  // }
  onSuccess = (res) => { 
    console.log('Login Success: currentUser:', res.profileObj);
    refreshTokenSetup(res);
    localStorage.setItem("jwtToken", res.tokenId);
    localStorage.setItem("google_login", true);
    const userData = {
      name: res.profileObj.name,
      email: res.profileObj.email,
      google_login:true
    };
    this.props.loginUser(userData);
  }
  onFailure = (res) => { 
    console.log('Login failed: res:', res);
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="container">
        <div style={{ marginTop: "4rem" }} className="row">
          <div className="col s8 offset-s2">
            <Link to="/" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to
              home
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4>
                <b>Login</b> below
              </h4>
              <p className="grey-text text-darken-1">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                  className={classnames("", {
                    invalid: errors.email || errors.emailnotfound
                  })}
                />
                <label htmlFor="email">Email</label>
                <span className="red-text">
                  {errors.email}
                  {errors.emailnotfound}
                </span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type="password"
                  className={classnames("", {
                    invalid: errors.password || errors.passwordincorrect
                  })}
                />
                <label htmlFor="password">Password</label>
                <span className="red-text">
                  {errors.password}
                  {errors.passwordincorrect}
                </span>
              </div>
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                  }}
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Login
                </button>
                {/* <button className="loginBtn loginBtn--google" ref="googleLoginBtn">
                    Login with Google
                </button> */}
              </div>
            </form>
            <h5>or</h5>
            <GoogleLogin
              clientId={clientId}
              buttonText="Login with Google"
              onSuccess={this.onSuccess}
              onFailure={this.onFailure}
              cookiePolicy={'single_host_origin'}
              style={{ marginTop: '100px' }}
              isSignedIn={true}
            />
            {/* <GoogleLogout
              clientId={clientId}
              buttonText="Logout"
              onLogoutSuccess={this.onLogoutSucc}
            ></GoogleLogout> */}
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
