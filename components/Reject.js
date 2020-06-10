import React,{ Component } from 'react';
import factory from './factory';
import web3 from './web3'
import {Layout,Link,Header,Modal,Divider,Label, TextArea,Icon,Card, Image,Container, Select, Button, Form,Input, Segment,Message} from 'semantic-ui-react'
import {auth,firebase} from '../config/auth'
import {Router} from '../routes';
import Loading from './Loading';

class Reject extends Component{
  constructor(props){
    super(props);
    this.state = {
      reason: '',
      account: '',
      pagestate:'display',
      hash:''
    }
    this.reject = this.reject.bind(this);
  }
  async reject(){
    try{
      console.log("reject");
      this.setState({pagestate:'processing'})
      var id = this.props.id;
      var by_ = this.props.currentAdmin;
      var stat = "reject";
      var reason = this.state.reason;
      if(this.state.reason == ''){
        throw {message:"Please provide a reason"};
      }
      var transferto_ = '';
      var notes = '';
      const accounts = await web3.eth.getAccounts();
      this.setState({account:accounts[0]});
      const _this = this;
      console.log(reason);
      await factory.methods.requestResponse(id,by_, stat, reason, notes, transferto_).send({from:accounts[0],gas:2400000}).on('transactionHash', function(hash){
         console.log(hash);
         _this.setState({hash});
      }).on('confirmation', function(confirmationNumber, receipt){
        var alertt = "Applcation Processed further successfully with transaction hash: " + _this.state.hash;
        alert(alertt);
        window.location.reload();
        // _this.setState({pagestate:"Success"})
        // _this.setState({transactionHash:hash})
       });
    }catch(error){
        console.log(error);
        alert("error occured while processing: " + error.message);
        window.location.reload();
    }
  }

   async componentDidMount(){
     const accounts = await web3.eth.getAccounts();
     this.setState({account:accounts[0]});

   }

  render(){
    return (
      <div>
      {
        (()=>{
          switch(this.state.pagestate){
            case 'processing': return(<Container><Loading value={"Application being Processed... Please wait a sec.."}/></Container>);
            default : return(<Modal
              closeIcon
              trigger={<Button  negative size="mini" icon labelPosition='right'>
                          Reject
                         <Icon name='thumbs down' />
                       </Button>}
              style={{height:"300px",marginLeft:"350px",marginTop:'150px'}}
              size='small'
            >
              <Header icon='browser' content={this.props.subject} />
              <Modal.Content>
                <h6>Are you sure you want to Reject? Reason for rejecting:</h6>
              </Modal.Content>
              <Form style={{paddingLeft:'15px',paddingRight:'15px'}}>
              <TextArea placeholder='Reason for rejecting:' value= {this.state.reason} onChange={ event => this.setState({reason:event.target.value})} style={{ minHeight: 100 }} />
              </Form>
              <Modal.Actions>
                <Button onClick={this.reject} negative size="large" icon labelPosition='right'>
                  Reject
                 <Icon name='thumbs down' />
               </Button>
              </Modal.Actions>
            </Modal>)
          }
        })()
      }
      </div>

    );
  }
}
export default Reject;
