import React,{ Component } from 'react';
import factory from '../../components/factory';
import web3 from '../../components/web3'
import Navbar from '../../components/Navbar'
import {Header, Icon, Image,Container, Select, Button, Form,Input, Segment,Message} from 'semantic-ui-react'
import {auth,firebase} from '../../config/auth'
import Transacting from '../../components/Transacting'
import RegistrationSuccess from '../../components/RegistrationSuccess'
import RegistrationSuccessError from '../../components/RegistrationSuccessError'
import {Router} from '../../routes';
const courseOptions = [
  {
  key: 'B. Tech',
  text: 'B Tech',
  value: 'B Tech',
  },
  {
  key: 'M. Tech',
  text: 'M Tech',
  value: 'M Tech',
  },
  {
  key: 'MBA',
  text: 'MBA',
  value: 'MBA',
  }
];
const branchOptions = [
  {
  key: 'CSE',
  text: 'CSE',
  value: 'CSE',
  },
  {
  key: 'ECE',
  text: 'ECE',
  value: 'ECE',
  },
  {
  key: 'ME',
  text: 'ME',
  value: 'Me',
  },
  {
  key: 'CE',
  text: 'CE',
  value: 'CE',
  }
];
const batchOptions = [
  {
    key: '2020',
    text: '2020',
    value: '2020',
  }
];

class RegistrationPayment extends Component{
  constructor(props){
    super(props);
    this.state = {
      firstname:'',
      lastname:'',
      batch:'',
      course:'',
      branch :'',
      jeerank: '',
      email:'',
      password:'',
      repassword: '',
      account: '',
      pagestate: 'form',
      transactionHash: ''
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.createUser = this.createUser.bind(this);
  }
  async componentDidMount(){
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    this.setState({account:accounts[0]});
    const _this = this;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
        // User is signed in.
        _this.setState({user});
        user.updateProfile({
          displayName: "student"
        }).then(function() {
          // Update successful.
          console.log("done");
          this.setState({pagestate:"success"});
        }).catch(function(error) {
          // An error happened.
        });
        // console.log(user.email);
      } else {
        // User is signed out.
        // ...
        _this.setState({user:null});
      }
    });
  }
  createUser(){
    console.log("in Create user");
    var email = this.state.email;
    var pass = this.state.password;
    auth.createUserWithEmailAndPassword(email, pass).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      this.setState({pagestate:"successerror"});
    });
    this.setState({pagestate:"success"});

  }
  async onSubmit(event){
    event.preventDefault();
    if(this.state.password.length < 6){
      alert("Password must be atleast 6 length long");
      return;
    }
    if(this.state.password != this.state.repassword){
      alert("ReEntered Password didn't matched");
      return;
    }
    var succeeded = false;

    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);
    this.setState({account:accounts[0]})
    const _this = this;
    try {
      this.setState({pagestate : 'transacting'})
      await factory.methods.payFees().send({
        from : accounts[0],
         value:  web3.utils.toWei('1', 'Ether'),
         gas: 240000
      }).on('transactionHash', function(hash){
         console.log(hash);
         _this.setState({transactionHash:hash});
         _this.createUser();
      });

    }catch(error){
        succeeded = false;
        this.setState({pagestate:"successerror"});
        console.log(error);
    }
};
  render(){
    return (
      <div>
        <Navbar />
        <Container style={{width:'50%',marginTop:'10px'}} >

        {(() => {
           switch (this.state.pagestate) {
             case "form":   return (
               <div>
                 <Header as='h2' icon textAlign='center'>
                   <Icon name='users' circular />
                   <Header.Content>Student Registration </Header.Content>
                 </Header>
                  <Form error={this.state.error} size={'small'} style={{marginTop:'20px'}} onSubmit = {this.onSubmit}>
                     <Form.Group widths='equal'>
                       <Form.Input required fluid value={this.state.firstname} onChange = { event => this.setState({ firstname:event.target.value })} id='form-subcomponent-shorthand-input-first-name' label='First name' placeholder='First name'/>
                       <Form.Input required fluid value={this.state.lastname} onChange = {event => this.setState({lastname:event.target.value})} id='form-subcomponent-shorthand-input-last-name' label='Last name' placeholder='Last name'  />
                     </Form.Group>
                     <Form.Group widths='equal'>
                       <Form.Field onChange = { (event,{value}) => this.setState({batch:value})} required fluid control={Select} label='Select Batch' placeholder='Select Batch' options = {batchOptions}  />
                       <Form.Field onChange = {(event,{value}) => this.setState({course:value})} required  fluid control={Select} label='Select Course' placeholder='selectCourse' options = {courseOptions} />
                     </Form.Group>
                     <Form.Group widths='equal'>
                       <Form.Field required onChange = {(event,{value}) => this.setState({branch:value})} fluid control={Select} label='Alloted Branch' placeholder='Alloted Branch' options = {branchOptions}  />
                       <Form.Input required onChange = {(event) => this.setState({jeerank: event.target.value})} type='number' fluid id='form-jeemain' label='Seat Allotment Number' placeholder='Seat Allotment Number'  />
                     </Form.Group>
                     <Form.Field value={this.state.email} type="email" onChange={(event) => this.setState({email: event.target.value})} required fluid id='form-input-control-error-email' control={Input} label='Email' placeholder='abc@xyz.com'/>
                     <Form.Group widths='equal'>
                     <Form.Input value={this.state.password} onChange={(event) => this.setState({password: event.target.value})}required label='Enter Password' type='password' />
                     <Form.Input error={this.state.passwordmatcherror} value={this.state.repassword} onChange={(event) => this.setState({repassword: event.target.value})}required label='ReEnter Password' type='password' />
                     </Form.Group>
                     <Header as='h4' block>
                       Registration Fees : 1 Ether<br />
                       Account: {this.state.account}
                     </Header>
                     <Container  textAlign='center'>
                      <Button positive  type ='submit'>Register</Button>
                     </Container>
                 </Form>
               </div>
              );
             case "transacting": return ( <Transacting />);
             case "success": return (<RegistrationSuccess hash = {this.state.transactionHash} />);
             case "successerror": return (<RegistrationSuccessError />);
             default: return "Error";
           }
         })()}
        </Container>
      </div>
    );
  }
}
export default RegistrationPayment;
