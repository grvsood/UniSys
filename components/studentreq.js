import React,{ Component } from 'react';
import factory from './factory';
import web3 from './web3'
import {Header,Modal,Divider,Label, TextArea,Icon,Card, Image,Container, Select, Button, Form,Input, Segment,Message} from 'semantic-ui-react'
import {auth,firebase} from '../config/auth'
import {Router} from '../routes';
import Transacting from './Transacting';
var items = [];
class Studentreq extends Component{
  constructor(props){
    super(props);
    this.state = {
      pagestate: 'applyreq',
      name: '',
      rollno: '',
      subject: '',
      to_:'',
      desc:'',
      branch: '',
      account:'',
      transactionHash:'',
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.writeUserData = this.writeUserData.bind(this);
  }
  writeUserData(userId, reqcountid) {
    firebase.database().ref('requests/' + userId  ).push().set(reqcountid);
  }
  async onSubmit(){
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    // console.log(accounts);
    this.setState({account:accounts[0]});
    this.setState({pagestate:'transacting'});
    const _this = this;
    let stdname = this.state.name;
    let rollno = this.state.rollno;
    let branch = this.state.branch;
    let subject = this.state.subject;
    let desc = this.state.desc;
    let to_ = this.state.to_;
    var database = firebase.database();
    var userId = firebase.auth().currentUser.uid;
    const reqcount = await factory.methods.getterreq().call();
    console.log(reqcount.toString());
    try{
      await factory.methods.createRequest(stdname, rollno, branch, subject, desc, to_).send({from : accounts[0],gas: 3000000}).on('transactionHash', function(hash){
         console.log(hash);
         _this.setState({pagestate:'applyreq'});
         // _this.setState({transactionHash:hash});
         _this.writeUserData(userId,reqcount);
      });;
    }catch(error){

        this.setState({pagestate:"successerror"});
        console.log(error);
    }


  }
  render(){
    return (
      <div>
      {
        (()=>{
          switch(this.state.pagestate){
            case 'transacting': return( <Transacting />);
            case 'applyreq': return (
              <Container>
                <Form onSubmit={this.onSubmit}>

                  <Form.Group inline>
                    <Input label="Name" required placeholder='Name' value={this.state.name} onChange={(event) => this.setState({name:event.target.value})}/>
                  </Form.Group>
                  <Form.Group inline>
                    <Input type='number' label="Roll No." placeholder='Roll No.' value={this.state.rollno} onChange={(event) => this.setState({rollno:event.target.value})}/>
                  </Form.Group>
                  <Form.Group inline>
                  <Input  label="Branch" placeholder='Branch' value={this.state.branch} onChange={(event) => this.setState({branch:event.target.value})}/>
                  </Form.Group>

                  <Form.Group inline>
                  <Label><p style={{textSize:'25px', width:'50px', textAlign:"center"}}><b>To</b>< /p></Label>
                  <Select value={this.state.to_} onChange={(event,{value}) => this.setState({to_:value})}  placeholder='To' options={
                    [
                      { key: 'Director', value: 'Director', text: 'Director' },
                      { key: 'CSE', value: 'CSE', text: 'CSE Department' },
                      { key: 'ECE', value: 'ECE', text: 'ECE Department' },
                      { key: 'ME', value: 'ME', text: 'ME Department' },
                      { key: 'CE', value: 'CE', text: 'CE Department' },
                      { key: 'TPO', value: 'TPO', text: 'TPO' },
                    ]} />
                    </Form.Group>

                  <Form.Group inline>
                    <Input required style={{width:'700px'}}fluid label="Subject" placeholder='Subject' value={this.state.subject} onChange={(event) => this.setState({subject:event.target.value})}/>
                  </Form.Group>
                  <Label><p style={{textSize:'20px'}}><b>Brief Description</b>< /p></Label><br />
                  <Form.Group inline>
                      <TextArea required style={{ minHeight: 100, maxHeight: 100 }} value={this.state.desc} onChange={event => this.setState({desc:event.target.value})} rows={4} placeholder='Tell us more' />
                  </Form.Group>
                  <Form.Group inline >
                    <Form.Field>
                    <Container style={{paddingLeft:'250px'}}>
                    <Button positive type ='submit'>Apply Application</Button>
                    </Container>
                    </Form.Field>
                  </Form.Group>


                </Form>
              </Container>
            );
            default: return "Error";
          }
        })()
      }

      </div>
    );
  }
}
export default Studentreq;
