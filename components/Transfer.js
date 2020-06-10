import React,{ Component } from 'react';
import factory from './factory';
import web3 from './web3'
import {Layout,Link,Header,Modal,Divider,Label, TextArea,Icon,Card, Image,Container, Select, Button, Form,Input, Segment,Message} from 'semantic-ui-react'
import {auth,firebase} from '../config/auth'
import {Router} from '../routes';
import Loading from './Loading';

class Trasnfer extends Component{
  constructor(props){
    super(props);
    this.state = {
      notes: '',
      account: '',
      to_:'',
      toarray: [],
      pagestate:'display',
      hash:'',
    }
    this.transfer = this.transfer.bind(this);
  }

  async transfer(){
    event.preventDefault();
    try{
      console.log("processing");
      this.setState({pagestate:'processing'})
      console.log("Transfer");
      var id = this.props.id;
      var by_ = this.props.currentAdmin;
      var stat = "transfer";
      var reason = "";
      var transferto_ = this.state.to_;
      var notes = this.state.notes;
      const accounts = await web3.eth.getAccounts();
      this.setState({account:accounts[0]});
      console.log(reason);
      const _this = this;
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
     var arr = [];
     var item = [
       { key: 'Director', value: 'Director', text: 'Director' },
       { key: 'CSE', value: 'CSE', text: 'CSE Department' },
       { key: 'ECE', value: 'ECE', text: 'ECE Department' },
       { key: 'ME', value: 'ME', text: 'ME Department' },
       { key: 'CE', value: 'CE', text: 'CE Department' },
       { key: 'TPO', value: 'TPO', text: 'TPO' },
     ];
     for(var i = 0; i < item.length; i++){
       if(item[i].key != this.props.currentAdmin){
         arr.push(item[i]);
       }
     }
     this.setState({toarray:arr});
   }

  render(){
    return (
      <div>
      {
        (()=>{
          switch(this.state.pagestate){
            case 'processing': return(<Container><Loading value={"Application being Processed... Please wait a sec.."}/></Container>);
            case 'display' : return(<Modal
              trigger={<Button  size="small" compact icon labelPosition='right'>Approve & Forward to<Icon name='right arrow' /></Button>}
              closeIcon
              style={{height:"340px",marginLeft:"350px",marginTop:'150px'}}
              size='small'
            >
              <Header icon='browser' content={this.props.subject} />
              <Modal.Content>
                <h6>Are you sure you want to Approve? and Send the application for futher processing:</h6>

                <Form onSubmit={this.transfer} style={{}}>
                  <Form.Group inline>
                  <Label basic><p style={{textSize:'30px', width:'150px', textAlign:"center"}}><b>Further Forward To</b>< /p></Label>
                  <Select value={this.state.to_} onChange={(event,{value}) => this.setState({to_:value})}  placeholder='To' options={this.state.toarray} />
                  </Form.Group>
                  <Form.Group inline>
                    <TextArea placeholder='Add Notes if any:' value= {this.state.notes} onChange={ event => this.setState({notes:event.target.value})} style={{ minHeight: 100 }} />
                  </Form.Group>

                  <Form.Group inline>
                    <Button submit compact size="large" color="yellow" icon labelPosition='right'>
                        Approve & Forward
                       <Icon name='play' />
                    </Button>
                  </Form.Group>
                </Form>
              </Modal.Content>
            </Modal>)
            default : return("error");
          }
        })()
      }
      </div>
    );
  }
}
export default Trasnfer;
