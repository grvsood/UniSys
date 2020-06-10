import React, { Component } from 'react';
import Web3 from 'web3'
import {Router} from '../routes'
import {auth,firebase} from '../config/auth'
class StudentServices extends Component{
  constructor(props) {
    super(props)
  }
  render(){
    return(

      <div onClick = {()=> {
        var user = firebase.auth().currentUser;
        if (user) {
          window.location.href = '/currentstudent/index'
  
        } else {
          // No user is signed in.
          window.location.href = '/currentstudent/login'

        }
      }}className = "StudentServices col-sm round cd">
        <div className="demo-card-square mdl-card mdl-shadow--2dp">
          <div className="mdl-card__title mdl-card--expand studentlogo">

          </div>

          <div className="mdl-card__actions mdl-card--border">
          <h5 >
             Student Services
          </h5>
          </div>
        </div>

      </div>

    );
  }
}

export default StudentServices;
