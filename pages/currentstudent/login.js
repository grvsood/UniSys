import React,{ Component } from 'react';
import factory from '../../components/factory';
import web3 from '../../components/web3'
import Navbar from '../../components/Navbar'
import {Header, Icon, Image,Container, Select, Button, Form,Input, Segment,Message} from 'semantic-ui-react'
import {auth,firebase} from '../../config/auth'
import {Router} from '../../routes';

class Login extends Component{
  constructor(props){
    super(props);
    this.state = {
      email:'',
      password: '',
      user: {},
      pagestate: 'form'
    };
    this.onSubmit = this.onSubmit.bind(this);
  }
  async componentDidMount(){
    const _this = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        _this.setState({user});
        window.location.href = '/currentstudent/index'
        // Router.pushRoute('/currentstudent/index');
        // ...
      } else {
        // User is signed out.
        // ...
        _this.setState({user:null});
      }
    });


  }
  onSubmit(){
    this.setState({pagestate:'message'})
    var email = this.state.email;
    var password = this.state.password
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
  }
  render(){
    return (
      <div>
        <Navbar />
        <Container style={{width:'500px'}}>
          <Header  style={{marginTop:'20px'}} as='h2' icon textAlign='center'>
            <Icon name='student' circular />
            <Header.Content>Student Login</Header.Content>
          </Header>
        { (()=>{
            switch(this.state.pagestate){
              case "form": return(
                <Form onSubmit={this.onSubmit} style={{marginTop:'20px'}}>
                  <Form.Group widths='equal'>
                    <Form.Input
                      placeholder='abc@xyz.com'
                      icon='user'
                      iconPosition='left'
                      fluid
                      required
                      name='email'
                      type='email'
                      label="Email"
                      value={this.state.email}
                      onChange={(event)=>{this.setState({email : event.target.value})}}
                    />
                  </Form.Group>
                  <Form.Group widths='equal'>
                    <Form.Input
                      placeholder='Password'
                      fluid
                      icon='lock'
                      iconPosition='left'
                      label="Password"
                      required
                      name='Password'
                      type='password'
                      value={this.state.password}
                      onChange={(event)=>{this.setState({password : event.target.value})}}
                    />
                  </Form.Group>
                  <Container  textAlign='center'>
                    <Form.Button positive content='Login' />
                  </Container>
                </Form>
              );
              case "message" : return (
                <Message icon>
                    <Icon name='circle notched' loading />
                    <Message.Content>
                      <Message.Header>Just one second</Message.Header>
                      We are login you in
                    </Message.Content>
                  </Message>
              );
              default: return "error";
            }
        })()}
          </Container>
      </div>
    );
  }
}
export default Login;
