import React, { Component } from 'react';
import Web3 from 'web3'
import {auth,firebase} from '../config/auth'

class AdminLogin extends Component{
  constructor(props) {
    super(props)
  }
  render(){
    return(
      <div onClick = {()=> {
        firebase.auth().signOut().then(function() {
          // Sign-out successful.
          console.log("signedout");
          window.location.href = '/admin/login';
        }).catch(function(error) {
          // An error happened.
          console.log(error);
        });
    }} className = "AdminLogin col-sm round cd">
        <div className="demo-card-square mdl-card mdl-shadow--2dp">
          <div className="mdl-card__title mdl-card--expand adminlogo">
          </div>

          <div className="mdl-card__actions mdl-card--border">
          <h5 >
             Admin Login
          </h5>
          </div>
        </div>

      </div>
    );
  }
}

export default AdminLogin;
