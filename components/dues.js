import React,{ Component } from 'react';
import factory from './factory';
import web3 from './web3'
import {Header,Modal,Divider,Label, Icon,Card, Image,Container, Select, Button, Form,Input, Segment,Message} from 'semantic-ui-react'
import {auth,firebase} from '../config/auth'
import {Router} from '../routes';
import Transacting from './Transacting';
var items = [];
class Mess extends Component{
  constructor(props){
    super(props);
    this.state = {
      name : ' ',
      rollno : ' ',
      subject : '',
      account : '',
      currentSem: '',
      semormess: 'sem',
      items: [],
      cardDisplay : true,
      data : '',
      transactionHash: '',
      pagestate: 'payfees',
      msgerror: false,
      msgerrordesc: '',
      amt: '',
      authority : ' ',
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.writeUserData = this.writeUserData.bind(this);
  }
  async componentDidMount(){
    const accounts = await web3.eth.getAccounts();
    // console.log(accounts);
    this.setState({account:accounts[0]});
    const _this = this;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
        // User is signed in.
        var userId =  firebase.auth().currentUser.uid;
      //  console.log(userId);
        firebase.database().ref('/fines/' + userId).once('value').then(function(snapshot) {
          var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
          items = [];
          var obj = snapshot.val();
          console.log(obj);
          for(let key in obj){
            var _amount = obj[key].amount;
            var _authority = obj[key].authority;
            var _hash = obj[key].hash;
            var _sem = obj[key].sem;
            var _subject = obj[key].subject;
            var _description = _sem + " Subject:" + _subject;
            var _meta = "Amount: " + _amount + " Ethers, To:" + _authority;
            items.push(
              {
                header:   <a href = {'https://ropsten.etherscan.io/tx/' + _hash} target="_blank">{_hash}</a>,
                description: _description,
                meta: _meta,
                fluid: true,
              }
            );
          }
          // console.log(items);
          _this.setState({items});
          // console.log(_this.state.items);
          _this.setState({cardDisplay: true});
        });
      } else {
      }
    });
  }

  writeUserData(userId, _hash, _amount) {
    var _sem = this.state.currentSem;
    var _subject = this.state.subject;
    var name = this.state.name;
    var rollno = this.state.rollno;
    var _to = this.state.authority;
    firebase.database().ref('fines/' + userId + '/' ).push().set({
      subject: _subject,
      sem: _sem,
      authority: _to,
      hash: _hash,
      amount: _amount,
    });


  }
  async onSubmit(){
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    // console.log(accounts);
    this.setState({account:accounts[0]});

    // console.log('submited');
    var database = firebase.database();
    var userId = firebase.auth().currentUser.uid;
    // console.log(userId);
    var hash = ''
    var amount = this.state.amt;
    if(amount <= 0 || amount > 1){
      alert("Invalid Amount");
      location.reload();
    }
    var _value;
    _value = web3.utils.toWei(amount, 'Ether');
    // console.log(_value);
    const _this = this;

    try {
      this.setState({pagestate:'transacting'})
      await factory.methods.payFees().send({
        from : accounts[0],
        value:  _value,
        gas: 240000
      }).on('transactionHash', function(hash){
         // console.log(hash);
         _this.setState({transactionHash:hash});
         _this.writeUserData(userId, hash, amount);
      }).on('confirmation', function(confirmationNumber, receipt){
        _this.setState({pagestate:'payfees'});
        location.reload();
      });
    }catch(error){
       this.setState({pagestate:"payfees"});
        // console.log(error);
        this.setState({msgerror:true});
        this.setState({msgerrordesc:error.message});
    }
  }
  render(){
    return (
      <div>
        {
          (()=>{
            switch(this.state.pagestate){
              case 'transacting': return( <Transacting />);
              case 'payfees': return (
                <Container>
                  <Form onSubmit={this.onSubmit}>
                  <Form.Group inline>
                    <Input label="Name" style={{width:'400px'}}required placeholder='Name' value={this.state.name} onChange={(event) => this.setState({name:event.target.value})}/>
                  </Form.Group>
                  <Form.Group inline>
                    <Input style={{width:'393px'}} type='number' label="Roll No." placeholder='Roll No.' value={this.state.rollno} onChange={(event) => this.setState({rollno:event.target.value})}/>
                  </Form.Group>
                  <Form.Group inline>
                    <Input style={{width:'400px'}} label="Subject" required placeholder='Subject' value={this.state.subject} onChange={(event) => this.setState({subject:event.target.value})}/>
                  </Form.Group>
                  <Form.Group inline>
                    <Input style={{width:'335px'}} type='number' label="Amount in Ethers" placeholder='Amount in Ethers' value={this.state.amt} onChange={(event) => this.setState({amt:event.target.value})}/>
                  </Form.Group>
                  <Form.Group inline>
                    <Input style={{width:'385px'}} label="Authority" required placeholder='Authority' value={this.state.authority} onChange={(event) => this.setState({authority:event.target.value})}/>
                  </Form.Group>
                  <Form.Group inline>
                      <Form.Field>
                          <Input label='Current Account' style={{width:'600px'}}    placeholder={this.state.account} value={this.state.account} />
                      </Form.Field>
                    </Form.Group>
                    <Form.Group inline>
                      <Form.Field>
                      <Input required label='Choose Semester' list='semester' placeholder='Choose Semester' style={{width:'600px'}} value={this.state.currentSem}
                      onChange={(event,{value}) => this.setState({currentSem:value})} />
                      <datalist id='semester'>
                        <option value='1st Semester' />
                        <option value='2nd Semester' />
                        <option value='3rd Semester' />
                        <option value='4th Semester' />
                        <option value='5th Semester' />
                        <option value='6th Semester' />
                        <option value='7th Semester' />
                        <option value='8th Semester' />
                      </datalist>
                      </Form.Field>
                    </Form.Group>
                    <Form.Group inline >
                      <Form.Field>
                      <Container style={{paddingLeft:'250px'}}>
                      <Button positive type ='submit'>Pay Fees</Button>
                      </Container>
                      </Form.Field>
                    </Form.Group>
                    <Message negative hidden={!this.state.msgerror} visible={this.state.msgerror}>
                     <Message.Header>Error</Message.Header>
                     <p>{this.state.msgerrordesc}</p>
                   </Message>
                  </Form>
                    <Container style={{marginTop:'30px'}}>
                    <Divider horizontal>
                      <Header as='h6'>
                        <Icon name='tag' />
                        Previous Transactions
                      </Header>
                    </Divider>

                    <Modal size='small'  centered={true} style={{height:'500px',marginTop:'100px', marginLeft:'300px'}} trigger={<Button primary >Chick Here to View Transactions</Button>}>
                      <Modal.Header>Transactions</Modal.Header>
                      <Modal.Content  scrolling>
                        <Modal.Description>
                        <Card.Group items={this.state.items} />
                        </Modal.Description>
                      </Modal.Content>

                    </Modal>
                    </Container>
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
export default Mess;
