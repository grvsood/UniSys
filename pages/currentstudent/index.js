import React,{ Component } from 'react';
import factory from '../../components/factory';
import web3 from '../../components/web3'
import Navbar from '../../components/Navbar'
import {Grid,Header, Icon, Image,Container, Button,Menu, Segment,Message} from 'semantic-ui-react'
import {auth,firebase} from '../../config/auth'
import {Router} from '../../routes';
import Login from './login'
import Mess from '../../components/mess'
import Dues from '../../components/dues'
import Studentreq from '../../components/studentreq'
import Viewapplication from '../../components/Viewapplication'
class Index extends Component{
  constructor(props){
    super(props);
    this.state = {
      user:{},
      activeItem: 'mess'
    };
  }


   async componentDidMount(){
     const _this = this
     firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
        // User is signed in.
        _this.setState(user);
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
        <Container  >
        <div className="indexDiv" style={{padding:"10px"}}>
          <Grid style={{height: '100vh'}}>
            <Grid.Column width={4} >
              <Menu  icon='labeled' color="green" fluid vertical pointing >
                <Menu.Item
                  icon="money bill alternate"
                  name='Pay Sem or Mess Fees'
                  active={this.state.activeItem === 'mess'}
                  onClick={(e, { name }) => this.setState({ activeItem: 'mess' })}
                />
                <Menu.Item

                  icon="inr"
                  name='Pay Fine and Dues'
                  active={this.state.activeItem === 'dues'}
                  onClick={(e, { name }) => this.setState({ activeItem: 'dues' })}
                />
                <Menu.Item
                  icon="file alternate"
                  name='Apply Application'
                  active={this.state.activeItem === 'application'}
                  onClick={(e, { name }) => this.setState({ activeItem: 'application' })}
                />
                <Menu.Item
                  icon="paper plane"
                  name='View Application Status'
                  active={this.state.activeItem === 'viewapplication'}
                  onClick={(e, { name }) => this.setState({ activeItem: 'viewapplication' })}
                />
                <Menu.Item>
                  <Button onClick={this.signOut} compact fluid primary>Sign Out</Button>
                </Menu.Item>
              </Menu>
            </Grid.Column>

            <Grid.Column stretched width={12}>
              {
                (()=>{
                  switch(this.state.activeItem){
                    case 'mess': return(
                      <Segment>
                        <Mess />
                      </Segment>
                    );
                    case 'dues': return (
                      <Segment>
                        <Dues />
                      </Segment>
                    );
                    case 'application': return (
                      <Segment>
                        <Studentreq />
                      </Segment>
                    )
                    case 'viewapplication': return (
                      <Segment>
                        <Viewapplication />
                      </Segment>
                    )
                    default:
                    return "Error";
                  }
                })()
              }
            </Grid.Column>
          </Grid>
        </div>
        </Container>
      </div>
    );
  }
}
export default Index;
