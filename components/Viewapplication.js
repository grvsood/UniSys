import React,{ Component } from 'react';
import factory from './factory';
import web3 from './web3'
import {Layout,Link,Header,Modal,Divider,Label, TextArea,Icon,Card, Image,Container, Select, Button, Form,Input, Segment,Message} from 'semantic-ui-react'
import {auth,firebase} from '../config/auth'
import {Router} from '../routes';
import Loading from './Loading';
import Transacting from './Transacting';
class Viewapplication extends Component{
  constructor(props){
    super(props);
    this.state = {
      pagestate:'loading',
      items: [],

    }
  }
  async componentDidMount(){
    // web3.eth.getCode('0x11FEA2DD8C33D8DcA17907BA13CCE464e5f3E8bB',function(err,code){
    //   console.log(code);
    // });
    // try{
    //   const reqcount = await factory.methods.getterreq().call();
    //   console.log(reqcount.toString());
    //   for(var i=1; i < reqcount; i++){
    //     const result = await factory.methods.viewRequest(i).call();
    //     console.log(result);
    //     console.log("*******");
    //   }
    // }
    // catch(err){
    //   console.log(err);
    // }
    const _this = this;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          var userId =  firebase.auth().currentUser.uid;
          firebase.database().ref('/requests/' + userId).once('value').then(async function(snapshot) {
              console.log(snapshot.val());
            var obj = snapshot.val();
            var ids = [];
            for(let key in obj){
              var val = obj[key];
              for( let  i in val){
                ids.push(parseInt(val[i]));
              }
            }
            // console.log(ids);
            _this.setState(ids);
            var contractitems = [];
            for(var i = 0; i < ids.length; i++){
              const result = await factory.methods.viewRequest(ids[i]).call();
              contractitems.push(result);
            }
            // console.log(contractitems);
            var items = contractitems.map((item) => {
              // console.log(item[10]);
              var subject = item.subject;
              var desc = item.briefdesc;
              var to_ = item.to_;
              var lastapproved = item.lastapproved;
              var finalised = item.finalised;
              var status= item.status;
              var appliedOn =  new Date(item[10].toNumber()*1000).toString();
              var lastUpdateOn = new Date(item[11].toNumber()*1000).toString();
              // var notes = item.notes;
              // var reason = item.reason;
              var metaStat= "";
              var color;
              if(status == "created"){
                metaStat = "Application has been created..in progress."
                color = "yellow";
              }
              else if(status == "accept") {
                metaStat = "Applciation has been passed.";
                color = "green";
              }
              else if(status == "reject"){
                metaStat = "Application has been rejected.";
                color = "red";
              }
              else{
                metaStat = "Applciation has moved forward.. in process... ";
              }
              var lastapprovedby_ = "Waiting for respective admin to monitor the application"
              if(lastapproved.length > 0) {
                lastapprovedby_ = "Recently proceeded from: " + lastapproved[lastapproved.length -1]+ `\n` + "On: " + lastUpdateOn;
              }
              var header = subject;
              var meta = metaStat;
              var description = desc;
              var content = "Applied on: " + `\n` + appliedOn + '\n' +  metaStat + `\n` + lastapprovedby_;
              return {
                header: header,
                meta:meta,
                description:description,
                fluid: true,
                color: color,
                button: true,
                content: content,
              }
            });
            // console.log(items);
            _this.setState({items});
            _this.setState({pagestate:'showcards'});
          });
        }
        else {
          console.log("User is logged out");
        }
    });
  }


  render() {
    return (
        <div>
        {
          (()=>{
            switch(this.state.pagestate){
              case 'loading': return(<Loading value="Please Wait. This will take just a minute" />);
              case 'showcards' : return(
                <Card.Group itemsPerRow={2}>
                  {
                    (()=>{
                      switch(this.state.items.length){
                        case 0: return("No Applications are submitted by the user");
                        default: return(
                          this.state.items.map( item =>{
                            return(
                              <Card color={item.color} style={{height:'250px'}} >
                                <Card.Content header={item.header} />
                                <Card.Content meta={item.meta} />
                                <Card.Content description={(item.description.length < 100) ? (item.description) : (item.description.substr(0,100)+ "..... ")} />
                                <Card.Content extra>
                                <Modal style={{height:'300px', marginTop:'200px', marginLeft:'230px'}} trigger={<Button style={{marginLeft:'100px'}} color={item.color}>Show Details</Button>}>
                                  <Modal.Header>{item.header}</Modal.Header>
                                  <Modal.Content scrolling>
                                    <Modal.Description>
                                      <p>
                                      <strong>Application Description: </strong>{item.description}
                                      <br />
                                      <strong>Status and Info: </strong>{item.content}
                                      </p>
                                    </Modal.Description>
                                  </Modal.Content>
                                </Modal>
                                </Card.Content>
                              </Card>
                            )
                          })
                        );
                      }
                    })()
                  }
                </Card.Group>
              );
              default : return("Error");
            }
          })()
        }
        </div>
    );
  }

}
export default Viewapplication;
