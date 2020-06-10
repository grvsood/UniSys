const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/Universitysystem.json');
// console.log(compiledFactory.interface);
const provider = new HDWalletProvider(
  'call glow acoustic vintage front ring trade assist shuffle mimic volume reject',
  'https://kovan.infura.io/v3/63ab2f2cfa04449bad8e3ec67ab9ea02'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', '0x2D0212d58933535c61c74E27E21987f9DAaee24A');

  const result = await new web3.eth.Contract(
    compiledFactory.abi
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: '1000000', from: '0x2D0212d58933535c61c74E27E21987f9DAaee24A' });

  console.log('Contract deployed to', result.options.address);
};
deploy();
