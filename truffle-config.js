require('babel-register');
require('babel-polyfill');
require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');

module.exports = {
  networks: {
    ropsten:{
      provider: function(){
        return new HDWalletProvider('call glow acoustic vintage front ring trade assist shuffle mimic volume reject',`https://ropsten.infura.io/v3/63ab2f2cfa04449bad8e3ec67ab9ea02`)
      } ,
      gasPrice: 25000000000,
      network_id: 3
    },
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    }
  },

  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
