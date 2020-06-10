import React, { Component } from 'react';
import { Container, Dimmer, Loader, Image, Segment } from 'semantic-ui-react'
class Loading extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <Container>
        <Dimmer active inverted>
          <Loader indeterminate size='large'>{this.props.value}</Loader>
        </Dimmer>
      </Container>
    );
  }
}

export default Loading;
