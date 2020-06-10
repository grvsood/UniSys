import React, { Component } from 'react';
import {Router} from '../routes'

class RegisterStudent extends Component{

  render(){
    //props not working
    return(
      <div onClick = {()=> window.location.href = '/registration/new'} className = "RegisterStudent col-sm cd">
        <div className="demo-card-square mdl-card mdl-shadow--2dp">
          <div className="mdl-card__title mdl-card--expand registerlogo">

          </div>

          <div className="mdl-card__actions mdl-card--border">
          <h5 >
             Student Registeration
          </h5>
          </div>
        </div>

      </div>
    );
  }
}

export default RegisterStudent;
