import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import {Bar,Doughnut,Line} from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css'
import { GoogleLogout } from 'react-google-login';
const clientId ='546377929056-q4llvpv9kgej63aae3b67oi2hii14lea.apps.googleusercontent.com';

class Dashboard extends Component {
  // componentDidMount(){
  //   !localStorage.getItem('google_login') ? alert('false') : alert('true');
  // }
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };
  onLogoutSucc = () => { 
    console.log('Logout Success');
    localStorage.removeItem('google_login');
    this.props.logoutUser();
  }
  state = {
    labels: ['January', 'February', 'March',
            'April', 'May'],
    datasets: [
      {
        label: 'Data',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: [65, 59, 80, 81, 56]
      }
    ]
  }
  render() {
    const { user } = this.props.auth;

    return (
      // <div style={{ height: "75vh" }} className="container valign-wrapper">
      <div  className="container">
        <div className="row">
          <div className="landing-copy col s12 center-align">
            <h4>
              <b>Hey there,</b> {user.name.split(" ")[0]}
              <p className="flow-text grey-text text-darken-1">
                {/* You are logged into a full-stack{" "}
                <span style={{ fontFamily: "monospace" }}>MERN</span> app 👏 */}
                You are logged in 👏
              </p>
            </h4>
            {!localStorage.getItem('google_login') ? ( 
              <button
                style={{
                  width: "150px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "1rem"
                }}
                onClick={this.onLogoutClick}
                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
              >
                Logout
              </button>
            ) : (<GoogleLogout
                clientId={clientId}
                buttonText="Logout"
                onLogoutSuccess={this.onLogoutSucc}
              ></GoogleLogout>)
            }
            {/* {localStorage.getItem('google_login') && 
              <GoogleLogout
                clientId={clientId}
                buttonText="Logout"
                onLogoutSuccess={this.onLogoutSucc}
              ></GoogleLogout>
            } */}
          </div>
        </div><br/>
        <h2>Statistics</h2>
        <div className="row" style={{border: '1px solid #d5d5d5',padding:'12px 0'}}>
          <div className="col-md-4" style={{borderRight: '1px solid #d5d5d5'}}>
            <Bar
              data={this.state}
              options={{
                title:{
                  display:true,
                  text:'Average Rainfall per month',
                  fontSize:20
                },
                legend:{
                  display:true,
                  position:'right'
                }
              }}
            />
          </div>
          <div className="col-md-4" style={{borderRight: '1px solid #d5d5d5'}}>
            <Doughnut
              data={this.state}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                title:{
                  display:true,
                  text:'Average data per month',
                  fontSize:20
                },
                legend:{
                  display:true,
                  position:'right'
                }
              }}
            />
          </div>
          <div className="col-md-4">
            <Line
              data={this.state}
              options={{
                title:{
                  display:true,
                  text:'Average data per month',
                  fontSize:20
                },
                legend:{
                  display:true,
                  position:'right'
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Dashboard);
