import React,{ Component } from 'react';
import factory from './factory';
import web3 from './web3'
import {Header,Modal,Divider,Label, Icon,Card, Image,Container, Select, Button, Form,Input, Segment,Message} from 'semantic-ui-react'
import Transacting from './Transacting';
var items = [];
class UploadDoc extends Component{
  constructor(props){
    super(props);
    this.state = {

    }
  }
  async componentDidMount(){
    const accounts = await web3.eth.getAccounts();
    // console.log(accounts);

  }


  render(){
    return (
      <div onClick = {()=> window.location.href = '/documents/upload'} className = "LogReports col-sm round cd">
        <Container style={{marginTop:'20px'}} >
          <Header as='h2'>
            <Icon name='upload' size='large' /> Upload Certificate / Degree
          </Header>
          (For officials only)\
        </Container>
      </div>
    );
  }
}
export default UploadDoc;
