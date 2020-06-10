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
        firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
          var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
          items = [];
          var obj = snapshot.val()
          for(let key in obj){
            var _header = "";
            var obje = obj[key];
            var amount = '';
            for(let item in obje){
              var _description= key;
              //console.log(item , obje[item]);
              _header = obje[item].hash;
              if(item == 'mess'){
                _description = _description + ": Mess Fees";
                amount = '0.1 Ether';
              }else if ( item == 'sem'){
                _description = _description + ": Semester Fees";
                amount = '0.3 Ether';
              }
              // console.log(_description);
              items.push(
                {
                  header:   <a href = {'https://ropsten.etherscan.io/tx/' + _header} target="_blank">{_header}</a>,
                  description: _description,
                  meta: amount,
                  fluid: true,
                }
              );
            }
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
    var sem = this.state.currentSem;
    var messorsem = this.state.semormess
    firebase.database().ref('users/' + userId + '/' + sem + '/' + messorsem ).set({
      hash: _hash,
      amount: _amount,
    });
    location.reload();

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
    var amount = '';
    var _value;
    if(this.state.semormess == 'sem'){
      amount = '0.3 Ether';
      _value = web3.utils.toWei('0.3', 'Ether');
    }else {
      amount = '0.1 Ether';
      _value = web3.utils.toWei('0.1', 'Ether');
    }
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
      }).on('confirmation', function(confirmationNumber, receipt){
        let hash = _this.state.transactionHash;
        _this.writeUserData(userId, hash, amount);
        _this.setState({pagestate:'payfees'});
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
                      <Input style={{width:'600px'}}>
                        <Label><p style={{textSize:'20px'}}><b>Fees Type</b>< /p></Label>
                        <Select value={this.state.semormess} onChange={(event,{value}) => this.setState({semormess:value})}  placeholder='Fees Type' options={
                        [
                          { key: 'sem', value: 'sem', text: 'Semester Fee' },
                          { key: 'mess', value: 'mess', text: 'Mess Fee' },
                        ]} />
                      </Input><br />
                    </Form.Group>
                    <Form.Group inline>
                      <Form.Field>
                        {
                         this.state.semormess == 'mess' ? (<Input label='Mess Fees' style={{width:'600px'}}  placeholder='0.1 Ether' value='0.1 Ether' />)
                         : (<Input label='Semester Fees' style={{width:'600px'}}  placeholder='0.3 Ether' value='0.3 Ether' />)
                        }
                      </Form.Field>
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
