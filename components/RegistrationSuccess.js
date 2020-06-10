import React, { Component } from 'react';
import { Container, Header,Icon, Button, Segment } from 'semantic-ui-react'
import {auth,firebase} from '../config/auth'
import {Router} from '../routes'
class RegistrationSuccess extends Component {
  constructor(props){
    super(props);
    this.state = {
      link: '0xb5c6d06d2acfd5f6c43e7544834095ef45fa6dea39f867c36e0d541188eb8406'
    }
    this.signout = this.signout.bind(this);
  }
  signout(){
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log("signedout");
    }).catch(function(error) {
      // An error happened.
      console.log(error);
    });
    Router.pushRoute('/');
  }
  render(){

    return (
      <div style={{marginTop:'140px'}}>
      <Segment placeholder>
        <Header icon>
          <Icon name='thumbs up outline' />
          Payment Succesful. Student Successfully Registered. <br />
          <a href = {'https://ropsten.etherscan.io/tx/' + this.props.hash} target="_blank">Chick here to check on EtherScan</a>
        </Header>
        <Button primary onClick={this.signout}>Home</Button>
      </Segment>
      </div>
    );
  }
}

export default RegistrationSuccess;
