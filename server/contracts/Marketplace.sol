// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Marketplace  {
    string public name;
    uint public productCount = 0;
    mapping(uint => Product) public products;

    struct Product{
      uint id;
      string name;
      uint price;
      address payable owner;
      bool purchased;
    }

    event ProductCreated(
      uint id,
      string name,
      uint price,
      address payable owner,
      bool purchased
    );

    event ProductPurchased(
      uint id,
      string name,
      uint price,
      address payable owner,
      bool purchased
    );

    constructor() public {
      name = "Nakib Marketplace";
    }

    function createProduct(string memory _name, uint _price) public {
      // Require a valid name
      require(bytes(_name).length > 0);
      // Require a valid price
      require(_price > 0);
      // Make sure the product is correct
      // Increment product count
      productCount ++;
      // Create the products
      products[productCount] = Product(productCount, _name, _price, msg.sender, false);
      // Trigger an event
      emit ProductCreated(productCount, _name, _price, msg.sender, false);
    }

    function purchaseProduct(uint _productId) public payable {
      //fetch the product
      Product memory _product = products[_productId];
      //fetch the owner
      address payable _seller = _product.owner;
      //make sure the products has a valid id
      require(_product.id > 0 && _product.id <= productCount);
      // // require that there is enough ether in the transaction
      require(msg.value >= _product.price);
      // // require that the product has not bee already purchased
      require(!_product.purchased);
      // // make sure that the buyer is not the seller
      require(_seller != msg.sender);
      //transfer ownership to the buyer
      _product.owner = msg.sender;
      //purchase the product
      _product.purchased = true;
      //Update the product
      products[_productId] = _product;
      //pay the seller by sending in eth
      address(_seller).transfer(msg.value);
      //trigger an event
      emit ProductPurchased(_productId, _product.name, _product.price, _product.owner, _product.purchased);
    }
}
