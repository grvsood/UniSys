import React,{ Component } from 'react';
import Head from 'next/head';
import factory from '../../components/factory';
import web3 from '../../components/web3'
import Navbar from '../../components/Navbar'
import {Header,Divider, Grid,Icon, Image,Container, Select, Button, Form,Input, Segment,Message} from 'semantic-ui-react'
import {auth,firebase} from '../../config/auth'
import {Router} from '../../routes';
import Loading from '../../components/Loading';

class Verify extends Component{
  constructor(props){
    super(props);
    this.state = {
      file :' ',
      preview : '',
      pagestate: 'form',
      msg : true,
      fileName : '',
      uploadon: '',
      uploadby: '',
      comment: '',
      msgetxt: '',
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.createHash = this.createHash.bind(this);
    this.toHex = this.toHex.bind(this);
    this.fileInput = React.createRef();
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

  createHash(file) {
    const _this = this;
    return new Promise(function(resolve, reject) {
      var reader = new FileReader();
      reader.onload = function() {
        var buffer = this.result;
        crypto.subtle.digest('SHA-256', buffer)
          .then(function(hash) {
            resolve(_this.toHex(hash));
          })
          .catch(reject);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
  toHex(buffer) {
    var i, n, k, value, stringValue, padding, paddedValue;
    var hexCodes = [];
    var view = new DataView(buffer);
    for (i = 0, n = view.byteLength, k = Uint32Array.BYTES_PER_ELEMENT; i < n; i += k) {
      // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
      value = view.getUint32(i);
      // toString(16) will give the hex representation of the number without padding
      stringValue = value.toString(16);
      // We use concatenation and slice for padding
      padding = '00000000';
      paddedValue = (padding + stringValue).slice(-padding.length);
      hexCodes.push(paddedValue);
    }
    // Join all the hex strings into one
    return hexCodes.join('');
  }
  async onSubmit(){
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    console.log("submit");

    const _this = this;
    alert(
      `Selected file - ${
        this.fileInput.current.files[0].name
      }`
    );
    var file = this.fileInput.current.files[0];
    if(true){
      this.setState({pagestate:'loading'});
      this.createHash(file).then(async function(hash) {
          //normalizing the hash
          if(hash.substring(0,2) !== '0x') {
            hash = "0x"+hash;
          }
          var fileHash = hash;
          console.log("metamask");

          const results = await factory.methods.entrySet(fileHash).call();
          try{
            console.log(results);
            if(results === null) throw "404 File Not Found";
            var _uploadon = new Date(results[1].toNumber()*1000).toString();
            console.log(_uploadon.toString());
            var ans = `FileName: ` + results[0] + `\n        Upload On:  ` +  _uploadon.toString() + `\n      Upload By: ` + results[3] + `\n     Comments: ` + results[2];
            console.log(ans);
            _this.setState({msgetxt: ans});
            _this.setState({msg:false});
            _this.setState({pagestate:'form'});
          }catch (err){
            _this.setState({msg:false})
            _this.setState({pagestate:'form'})
            _this.setState({msgetxt: 'Forge Document. File is not officially from the University.'})
          }
          }).catch(function(err) {
          console.error(err);
        });

    }
    else{
      alert("No file Uploaded")
    }
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
      { (()=>{
          switch(this.state.pagestate){
            case "form": return(
              <Container style={{width:'500px',padding:"10px"}}>
                <Segment style={{marginTop:'100px',width:'500px',height:'300px'}} placeholder>
                <Container style={{padding:"10px"}}>
                  <div class="col-lg">
                  <Header as='h2'>
                    <Icon name='check circle' size='large' /> Verify Certificate / Degree
                  </Header>
                    <form  onSubmit={this.onSubmit} enctype="multipart/form-data">
                      <div class="form-group">
                        <label for="fileWrite">File:</label>
                        <input ref={this.fileInput}  class="form-control" id="fileWrite" name="fileWrite" type="file" />
                      </div>
                      <button   class="btn btn-primary btn-block" type="submit" >Submit new Entry</button>
                    </form>
                    <button style={{marginTop:"10px"}}onClick={ ()=>{window.location.href = '/documents/verification'}}  class="btn btn-secondary btn-block" type="button" >back</button>
                  </div>

                  </Container>
                </Segment>
                  <Message style={{width:'500px'}} hidden={this.state.msg}>
                    {this.state.msgetxt}
                  </Message>
            </Container>
            );
            case "loading" : return (
                <Loading value="Checking Status" />
            );
            case "result" : return (
                <div>result</div>
            )
            default: return "error";
          }
      })()}
      </div>
    );
  }
}
export default Verify;
