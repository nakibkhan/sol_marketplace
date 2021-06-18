const Marketplace = artifacts.require("./Marketplace.sol");

contract('Marketplace', (accounts) =>{
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
        result = await marketplace.createProduct()
        productCount = await marketplace.productCount()
      })

      it('creates product', async() =>{
        assert.equal(productCount, 1)
      })


    })
  })

})
