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
      address owner;
      bool purchased;
    }

    constructor() public {
      name = "Nakib Marketplace";
    }

    function createProduct() public {
      // Make sure the product is correct
      // Increment product count
      productCount ++;
      // Create the products
      // Trigger an event

    }
}
