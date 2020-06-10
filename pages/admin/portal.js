import React,{ Component } from 'react';
import factory from '../../components/factory';
import web3 from '../../components/web3'
import Navbar from '../../components/Navbar'
import {Layout,Table,Grid,Link,Header,Modal,Divider,Label, TextArea,Icon,Card, Image,Container, Select, Button, Form,Input, Segment,Message} from 'semantic-ui-react'
import {auth,firebase} from '../../config/auth'
import {Router} from '../../routes';
import Loading from '../../components/Loading';
import Approve from '../../components/Approve';
import Reject from '../../components/Reject';
import Transfer from '../../components/Transfer';

class Portal extends Component{
  constructor(props){
    super(props);
    this.state = {
      user:{},
      pagestate: 'loading',
      currentAdmin: 'None',
      items: [],
      currentID: '',
      reason: '',
      notes: '',
      transferto_: '',

    };
    this.signOut = this.signOut.bind(this);
  }




   async componentDidMount(){
     const _this = this
     var items = []
     firebase.auth().onAuthStateChanged(async function(user) {
        if (user) {
        // User is signed in.
        console.log(user.displayName);
        _this.setState({currentAdmin:user.displayName});
        _this.setState(user);
        try{
          const reqcount = await factory.methods.getterreq().call();
          console.log(reqcount.toString());
          for(var i=1; i < reqcount; i++){
            const result = await factory.methods.viewRequest(i).call();
            console.log(result);
            if(result.to_ == _this.state.currentAdmin && result.finalised != true) items.push({value:result,id:i});
          }
          console.log(items);
          _this.setState({items});
          _this.setState({pagestate:'showapp'})
        }catch(err){
          console.log(err);
        }
      } else {
        // User is signed out.
        // ...
        _this.setState(user:null);
      }
    });
  }
  signOut(){
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log("signedout");
      window.location.href = '/'
    }).catch(function(error) {
      // An error happened.
      console.log(error);
    });
  }

  render(){

    return (
      <div>
        <Navbar />
        <div className="indexDiv" style={{padding:"5px",height: '100vh'}}>
        {
          (()=>{
            switch(this.state.pagestate){
              case 'loading': return (<Container><Loading value={"Loading Applications... Please wait a sec.."}/></Container>);
              case 'showapp': return(
                  <Table celled padded  >
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell singleLine>From: Name</Table.HeaderCell>
                        <Table.HeaderCell>Branch</Table.HeaderCell>
                        <Table.HeaderCell>Roll No</Table.HeaderCell>
                        <Table.HeaderCell>App To</Table.HeaderCell>
                        <Table.HeaderCell>Subject</Table.HeaderCell>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell>Approve</Table.HeaderCell>
                        <Table.HeaderCell>Reject</Table.HeaderCell>
                        <Table.HeaderCell>Forward to</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {
                      (()=>{
                        switch(this.state.items.length){
                          case 0: return("No Applciations are pending.");
                          default: return(
                            this.state.items.map( item =>{
                              console.log(item);
                              return(
                                <Table.Row>
                                  <Table.Cell>{item.value.stdname}</Table.Cell>
                                  <Table.Cell >{item.value.branch}</Table.Cell>
                                  <Table.Cell>{item.value.rollno}</Table.Cell>
                                  <Table.Cell>{item.value.to_ }</Table.Cell>
                                  <Table.Cell singleLine >{ (item.value.subject.length <25)?(item.value.subject) : (item.value.subject.substr(0,25) + "... ")}
                                      {(item.value.subject.length>25) ? (<Button size='mini' circular icon='quote left' />) : ("")}
                                  </Table.Cell>
                                  <Table.Cell singleLine>{item.value.briefdesc.substr(0,25) + "... "}
                                     <Modal closeOnDimmerClick={false} closeIcon basic trigger={<Button size='mini' circular icon='quote left' />}>
                                      <Modal.Header>Application ID: #{item.id}</Modal.Header>
                                      <Modal.Content>
                                        <p>
                                          <b>Name: </b>{item.value.stdname}<br />
                                          <b>Branch: </b>{item.value.branch}<br />
                                          <b>Roll No: </b>{item.value.rollno}<br />
                                          <b>To: </b> {item.value.to_}<br />
                                          <b>Applied on: </b> {new Date(item.value[10].toNumber()*1000).toString()}<br />
                                          <br />
                                          <b>Subject:</b> {item.value.subject}<br />
                                          <br />
                                          {item.value.briefdesc}
                                        </p>
                                        <Grid.Row >
                                        <Grid.Column>
                                        <Approve id={item.id} currentAdmin={this.state.currentAdmin} subject={item.value.subject}  />
                                        </Grid.Column>
                                        <Grid.Column>
                                        <Transfer id={item.id} currentAdmin={this.state.currentAdmin} subject={item.value.subject} />
                                        </Grid.Column>
                                        <Grid.Column>
                                        <Reject id={item.id} currentAdmin={this.state.currentAdmin} subject={item.value.subject} />
                                        </Grid.Column>
                                        </Grid.Row>
                                      </Modal.Content>
                                      <Modal.Actions>
                                        </Modal.Actions>
                                     </Modal>
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Approve id={item.id} currentAdmin={this.state.currentAdmin} subject={item.value.subject}  />
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Reject id={item.id} currentAdmin={this.state.currentAdmin} subject={item.value.subject} />
                                  </Table.Cell>
                                  <Table.Cell singleLine>
                                    <Transfer id={item.id} currentAdmin={this.state.currentAdmin} subject={item.value.subject} />
                                  </Table.Cell>
                                </Table.Row>
                              )
                            })
                          );
                        }
                      })()
                    }
                  </Table.Body>
                </Table>

              )
            }
          })()
        }
        </div>

      </div>
    );
  }
}
export default Portal;
