import React, { Component } from 'react';
import Web3 from 'web3'

class LogReports extends Component{
  constructor(props) {
    super(props)
  }
  render(){
    return(
      <div onClick = {()=> window.location.href = '/documents/verification'} className = "LogReports col-sm round cd">
        <div className="demo-card-square mdl-card mdl-shadow--2dp">
          <div className="mdl-card__title mdl-card--expand logreportslogo">

          </div>

          <div className="mdl-card__actions mdl-card--border">
          <h5 >
             Certificates Validation
          </h5>
          </div>
        </div>

      </div>
    );
  }
}

export default LogReports;
