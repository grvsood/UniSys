import React, { Component } from 'react';
import Head from 'next/head';
import factory from './factory';
import web3 from './web3';
import {Router} from '../routes'
import {auth,firebase} from '../config/auth'
import {Button} from 'semantic-ui-react'
class Navbar extends Component {
  constructor(props){
    super(props);
    this.state = {
      account: '',
      user: {}
    }
    this.signout = this.signout.bind(this);
  }
  signout(){
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log("signedout");
      window.location.href = '/'
    }).catch(function(error) {
      // An error happened.
      console.log(error);
    });

    //Router.pushRoute('/');
  }
  async componentDidMount(){
    const _this = this;
    console.log(factory.address);
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
        // User is signed in.
        _this.setState({user});
        console.log(user.email);

      } else {
        // User is signed out.
        // ...
        _this.setState({user:null});
      }
    });
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    this.setState({account:accounts[0]});


  }
  render() {
    return (
      <nav className="navbar navbar-dark navbar-fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <Head>
          <meta charset="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <meta name="theme-color" content="#000000" />
          
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
          <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.indigo-pink.min.css"/>
          <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>

          <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />

          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"/>


          <link rel="stylesheet" href="/static/App.css" />
          <title>UniSys</title>
        </Head>
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="/"
          rel="noopener noreferrer"
        >
          UniSys
        </a>

        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-white"><span id="account">  Current Account: {this.state.account} </span></small>
            { this.state.user != null &&  (<Button onClick={this.signout} size="mini" compact>SignOut</Button>)}
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
