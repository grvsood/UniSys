import React,{ Component } from 'react';
import factory from '../components/factory';
import web3 from '../components/web3';
import Navbar from '../components/Navbar';
import Cards from '../components/Cards';
import {auth,firebase} from '../config/auth'

class App extends Component{
  App(){
    this.state = {
      uniAddress :'0x2D0212d58933535c61c74E27E21987f9DAaee24A'
    }
  }
  componentDidMount(){
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
        <center>
          <div className= "mainDiv">
            <center>
              <Cards />
            </center>
          </div>
        </center>
      </div>
    );
  }
}
export default App;
