import web3 from './web3';
import Universitysystem from '../src/abis/Universitysystem.json'

const uni = '0xa0221a59626F878b4Cb44f9Dd91783b2c577117C';
const instance = web3.eth.Contract(Universitysystem.abi,uni);


//
// const accounts =  web3.eth.getAccounts()
// const networkId =  web3.eth.net.getId()
// let instance
// const networkData = Universitysystem.networks[networkId]
// if(networkData) {
//  instance= web3.eth.Contract(Universitysystem.abi, networkData.address)
//   console.log(universitysystem);
// } else {
//   console.log('Universitysystem contract not deployed to detected network.')
// }

export default instance;
