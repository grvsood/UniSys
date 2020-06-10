import React, { Component } from 'react';
import { Container, Dimmer, Loader, Image, Segment } from 'semantic-ui-react'
class Transacting extends Component {
  render(){
    return (
      <Container>
        <Dimmer active inverted>
          <Loader indeterminate size='large'>Your payment is being submitted. Please do not close this window or click the Back button on your browser</Loader>
        </Dimmer>
      </Container>
    );
  }
}

export default Transacting;
