import Web3 from 'web3';

let web3;

if(typeof window !== 'undefined' && typeof window.web3 !== 'undefined'){
  //we are in browser
  web3 = new Web3(window.web3.currentProvider);
}
else{
  // we are on browser
  const provider = new Web3.providers.HttpProvider(
    'https://ropsten.infura.io/v3/63ab2f2cfa04449bad8e3ec67ab9ea02'
  );
  web3 = new Web3(provider);
}

export default web3;
