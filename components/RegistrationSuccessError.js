import React, { Component } from 'react';
import {Router} from '../routes'
import { Container, Header,Icon, Button, Segment } from 'semantic-ui-react'
class RegistrationSuccessError extends Component {
  constructor(props){
    super(props);
    this.onClicked = this.onClicked.bind(this);
  }
  onClicked(){
    window.location.href = "/";
  }
  render(){
    return (
      <div style={{marginTop:'140px'}}>
      <Segment placeholder>
        <Header icon>
          <Icon name='thumbs down outline' />
          Payment Unsuccesful. Student Not Registered. Try Again.
        </Header>
        <Button onClick = {this.onClicked} primary>Home</Button>
      </Segment>
      </div>
    );
  }
}

export default RegistrationSuccessError;
