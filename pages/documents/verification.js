import React,{ Component } from 'react';
import Head from 'next/head';
import factory from '../../components/factory';
import web3 from '../../components/web3'
import Navbar from '../../components/Navbar'
import UploadDoc from '../../components/uploadcard'
import Verify from '../../components/verifycard'
import {Header,Divider, Grid,Icon, Image,Container, Select, Button, Form,Input, Segment,Message} from 'semantic-ui-react'
import {auth,firebase} from '../../config/auth'
import {Router} from '../../routes';

class Verification extends Component{
  constructor(props){
    super(props);
    this.state = {

    };
  }
  async componentDidMount(){
    const _this = this;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
        _this.setState({user});
        firebase.auth().signOut().then(function() {
          // Sign-out successful.
          console.log("signedout");
        }).catch(function(error) {
          // An error happened.
          console.log(error);
        });

      } else {
        // User is signed out.
        // ...
        _this.setState({user:null});
      }
    });


  }

  render(){
    return (
      <div>
        <Navbar />
        <Head>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous"/>
          <script>console.log("hi")</script>
          <link rel="stylesheet" href="/static/styledocs.css" />
        </Head>

        <Container style={{width:'500px'}}>
          <Segment style={{marginTop:'100px',width:'500px'}} placeholder>
            <Grid columns={2} relaxed='very' stackable>
              <Grid.Column >
                <UploadDoc />
              </Grid.Column>

              <Grid.Column verticalAlign='middle'>
                <Verify />
              </Grid.Column>
            </Grid>
            <Divider vertical>Or</Divider>
          </Segment>
          <center>
          <button style={{marginTop:"10px",width:"50px"}}onClick={ ()=>{window.location.href = '/'}}  class="btn btn-secondary btn-block" type="button" >Back </button>
          </center>
        </Container>

      </div>
    );
  }
}
export default Verification;
