pragma solidity ^0.5.10;

contract Card {
    string public name;
    uint public productCount = 0;
    mapping(uint => Product) public products;

    struct Product {
        uint id;
        string name;
        uint price;
        string imageURL;
        address payable owner;
        bool purchased;
    }

    event ProductCreated(
        uint id,
        string name,
        uint price,
        string imageURL,
        address payable owner,
        bool purchased
    );

    event ProductPurchased(
        uint id,
        string name,
        uint price,
        string imageURL,
        address payable owner,
        bool purchased
    );

    constructor() public {
        name = "NFT CARD MARKETPLACE";
    }

    function createProduct(string memory _name, uint _price, string memory _imageURL) public {
        require(bytes(_name).length > 0, 'product name should not be empty');
        require(_price > 0, 'product price should not be empty');
        productCount++;
        products[productCount] = Product(productCount, _name, _price, _imageURL, msg.sender, false);
        // Trigger on event
        emit ProductCreated(productCount, _name, _price, _imageURL, msg.sender, false);
    }

    function purchaseProduct(uint _id) public payable {
        //Get data
        Product memory _product = products[_id]; //Fetch the product
        address payable _seller = _product.owner; //Fetch the product

        //Pre-Checks for valid data
        //Check valid id
        require(_product.id > 0 && _product.id <= productCount, 'Invalid product id');
        //Check enough ether in transaction
        require(msg.value >= _product.price, 'Not enough ether');
        //Check product is not purchased
        require(!_product.purchased, 'Already purchased');
        //Check buyer is not seller
        require(_seller != msg.sender, 'Cannot buy owned product');

        //Update data
        //Transfer Ownership
        _product.owner = msg.sender;
        //Mark Purchased
        _product.purchased = true;
        //Update product
        products[_id] = _product;

        //Transfer Funds
        //Pay the seller by sending ether
        address(_seller).transfer(msg.value);

        // Trigger on event
        emit ProductPurchased(productCount, _product.name, _product.price, _product.imageURL, msg.sender, true);
    }
}
