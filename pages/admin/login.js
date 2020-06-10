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
    var setName = 'ECE';
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        _this.setState({user});
        var userName= "";

        //To set User Name
        // user.updateProfile({
        //   displayName: setName,
        // }).then(function() {
        //   // Update successful.
        //   console.log("Name Set");
        // }).catch(function(error) {
        //   // An error happened.
        // });

        user.providerData.forEach(function (profile) {
            // console.log("Sign-in provider: " + profile.providerId);
            // console.log("  Provider-specific UID: " + profile.uid);
            userName = profile.displayName;
            // console.log("  Email: " + profile.email);
        });

        if(userName!= "student"){
          console.log(userName);
          window.location.href = '/admin/portal';
        }else{
          firebase.auth().signOut().then(function() {
            // Sign-out successful.
            console.log("signedout");
            alert("Invalid Admin Email and Password")
            _this.setState({pagestate:'form'})
          }).catch(function(error) {
            // An error happened.
            console.log(error);
          });
        }


        // window.location.href = '/admin/portal';

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
            <Header.Content>Admin Login</Header.Content>
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
