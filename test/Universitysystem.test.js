const Universitysystem = artifacts.require("Universitysystem");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Universitysystem', ([uni,student]) => {
  let unisys

  before(async () => {
    unisys = await Universitysystem.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await unisys.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await unisys.name()
      assert.equal(name, 'University Transaction System')
    })

    it('Pays fees', async() => {

      let oldUniBalance
      oldUniBalance = await web3.eth.getBalance(uni)
      oldUniBalance = new web3.utils.BN(oldUniBalance)
      let result = await unisys.payFees(uni, 1, {from:student, value:  web3.utils.toWei('1', 'Ether')})

      const event = result.logs[0].args
      assert.equal(event.from_, student, 'Sender is correct')
      assert.equal(event.to_, uni, 'University is correct')
      assert.equal(event.success, true, 'Fees Paid')

      let newUniBalance
      newUniBalance = await web3.eth.getBalance(uni)
      newUniBalance = new web3.utils.BN(newUniBalance)
      let price
      price = web3.utils.toWei('1','Ether')
      price = new web3.utils.BN(price)

      const expectedBalance = oldUniBalance.add(price)
      assert.equal(newUniBalance.toString(),expectedBalance.toString())

      //Enough ether send (sending half ether)
      await unisys.payFees(uni, 0.1 , {from: student, value: web3.utils.toWei('0.05', 'Ether')}).should.be.rejected;
      //Buyer cant be the seller buyer can buy twice
      await unisys.payFees(uni , 0.1, {from: uni, value: web3.utils.toWei('0.1', 'Ether')}).should.be.rejected;

    })
  })
})
