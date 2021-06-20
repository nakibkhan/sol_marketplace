const Marketplace = artifacts.require("./Marketplace.sol");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Marketplace', ([deployer, seller, buyer]) =>{
  let marketplace

  before(async () =>  {
      marketplace = await Marketplace.deployed()
  })

  describe('deployment', async() =>{
    it('displays successfully', async() =>  {
      const address = await marketplace.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async() => {
      const name = await marketplace.name()
      assert.equal(name, "Nakib Marketplace")
    })

    describe('products', async () =>{
      let result, productCount

      before(async() =>{
        result = await marketplace.createProduct('Funny Bone Tickets', web3.utils.toWei('1', 'Ether'), {from: seller})
        productCount = await marketplace.productCount()
      })

      it('creates product', async() =>{
        assert.equal(productCount, 1)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), productCount.toNumber(), 'Product ID is correct')
        assert.equal(event.name, 'Funny Bone Tickets', 'Product Name is correct')
        assert.equal(event.price, web3.utils.toWei('1', 'Ether'), 'Product Price is correct')
        assert.equal(event.owner, seller, 'Product Owner is correct')
        assert.equal(event.purchased, false, 'Purchased Status is correct')

        await marketplace.createProduct('', web3.utils.toWei('1', 'Ether'), {from: seller}).should.be.rejected
      })

      it('lists product', async() =>{
        const product = await marketplace.products(productCount)

        assert.equal(productCount, 1)
        const event = result.logs[0].args
        assert.equal(product.id.toNumber(), productCount.toNumber(), 'Product ID is correct')
        assert.equal(product.name, 'Funny Bone Tickets', 'Product Name is correct')
        assert.equal(product.price, web3.utils.toWei('1', 'Ether'), 'Product Price is correct')
        assert.equal(product.owner, seller, 'Product Owner is correct')
        assert.equal(product.purchased, false, 'Purchased Status is correct')
      })

      it('Sells Products', async()=>{
        // Track the seller balance before the purchase transaction
        let oldSellerBalance 
        oldSellerBalance = await web3.eth.getBalance(seller)
        oldSellerBalance = new web3.utils.toBN(oldSellerBalance)

        //SUCCESS: buyer makes the purchase
        result = await marketplace.purchaseProduct(productCount, {from: buyer, value: web3.utils.toWei('1', 'Ether')})

        // Check the logs
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), productCount.toNumber(), 'Product ID is correct')
        assert.equal(event.name, 'Funny Bone Tickets', 'Product Name is correct')
        assert.equal(event.price, web3.utils.toWei('1', 'Ether'), 'Product Price is correct')
        assert.equal(event.owner, buyer, 'Product Owner is correct')
        assert.equal(event.purchased, true, 'Purchased Status is correct')

        // Check the seller received the funds
        let newSellerBalance 
        newSellerBalance = await web3.eth.getBalance(seller)
        newSellerBalance = new web3.utils.toBN(newSellerBalance)

        let price
        price = web3.utils.toWei('1', 'Ether')
        price = new web3.utils.toBN(price)
        
        console.log(oldSellerBalance, newSellerBalance, price)

        const expectedBalance = oldSellerBalance.add(price).toString()

        assert.equal(expectedBalance, newSellerBalance)
      })

      // // FAILURE: Tries to buy a product that does not exist
      describe('product that does not exist', async () => {
        it('blank product', async()  =>{
          await marketplace.purchaseProduct('Some other product', {from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected
        });

        it('blank price', async() =>{
          await marketplace.purchaseProduct('Funny Bone Tickets', {from: buyer, value: web3.utils.toWei('0.5', 'Ether')}).should.be.rejected
        })
      })

    })
  })

})
