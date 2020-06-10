import React, { Component } from 'react';
import RegisterStudent from './RegisterStudent'
import StudentServices from './StudentServices'
import AdminLogin from './AdminLogin'
import LogReports from './LogReports'
class Cards extends Component{
  constructor(props) {
    super(props);
  }

  render(){
    return(
      <div className="container" >
        <div className="row">
          <RegisterStudent />
          <StudentServices />
          <AdminLogin />
          <LogReports />
        </div>
      </div>
    );
  }
}

export default Cards;
