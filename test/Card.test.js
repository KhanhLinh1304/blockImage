const Card = artifacts.require("Card");
const { assert } = require("chai");

require("chai").use(require("chai-as-promised")).should();

contract("Card", ([deployer, seller, buyer]) => {
  //accounts
  let card;

  before(async () => {
    card = await Card.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await card.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("it has name", async () => {
      const name = await card.name();
      assert.equal(name, "NFT CARD MARKETPLACE");
    });
  });

  describe("product", async () => {
    let result, productCount;

    before(async () => {
      result = await card.createProduct(
        "card game",
        web3.utils.toWei("1", "Ether"),
        "example-image-url",
        { from: seller }
      );
      productCount = await card.productCount();
    });

    it("creates product", async () => {
      // SUCCESS
      assert.equal(productCount, 1);

      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), productCount.toNumber(), "id is correct");
      assert.equal(event.name, "card game", "name is correct");
      assert.equal(event.price, "1000000000000000000", "price is correct");
      assert.equal(event.imageURL, "example-image-url", "imageURL is correct");
      assert.equal(event.owner, seller, "owner is correct");
      assert.equal(event.purchased, false, "purchased is correct");

      // FAILURES: for product name and product price
      await card.createProduct("", web3.utils.toWei("1", "Ether"), "example-image-url", { from: seller })
        .should.be.rejected;
      await card.createProduct("card game", 0, "example-image-url", { from: seller })
        .should.be.rejected;
    });

    it("lists product", async () => {
      // SUCCESS
      const product = await card.products(productCount);
      assert.equal(product.id.toNumber(), productCount.toNumber(), "id is correct");
      assert.equal(product.name, "card game", "name is correct");
      assert.equal(product.price, "1000000000000000000", "price is correct");
      assert.equal(product.imageURL, "example-image-url", "imageURL is correct");
      assert.equal(product.owner, seller, "owner is correct");
      assert.equal(product.purchased, false, "purchased is correct");
    });

    it("sells products", async () => {
      let oldSellerBalance;
      oldSellerBalance = await web3.eth.getBalance(seller);
      oldSellerBalance = new web3.utils.BN(oldSellerBalance);

      // SUCCESS: buyer makes purchase
      result = await card.purchaseProduct(productCount, {
        from: buyer,
        value: web3.utils.toWei("1", "Ether"),
      });

      // Check logs
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), productCount.toNumber(), "id is correct");
      assert.equal(event.name, "card game", "name is correct");
      assert.equal(event.price, "1000000000000000000", "price is correct");
      assert.equal(event.imageURL, "example-image-url", "imageURL is correct");
      assert.equal(event.owner, buyer, "owner is correct");
      assert.equal(event.purchased, true, "purchased is correct");

      // Check seller receive funds
      let newSellerBalance;
      newSellerBalance = await web3.eth.getBalance(seller);
      newSellerBalance = new web3.utils.BN(newSellerBalance);
      let price;
      price = web3.utils.toWei("1", "Ether");
      price = new web3.utils.BN(price);

      expectedSellerBalance = oldSellerBalance.add(price);

      assert.equal(expectedSellerBalance.toString(), newSellerBalance.toString());

      // FAILURES: Tries to buy product with Invalid id
      await card.purchaseProduct(99, {
        from: buyer,
        value: web3.utils.toWei("1", "Ether"),
      }).should.be.rejected;

      // FAILURES: Buyer tries to buy without enough ether
      await card.purchaseProduct(productCount, {
        from: buyer,
        value: web3.utils.toWei("0.5", "Ether"),
      }).should.be.rejected;

      // FAILURES: Deployer tries to buy product, i.e., product can't be purchased twice
      await card.purchaseProduct(productCount, {
        from: deployer,
        value: web3.utils.toWei("1", "Ether"),
      }).should.be.rejected;

      // FAILURES: Buyer tries to buy again, i.e., buyer can't be seller
      await card.purchaseProduct(productCount, {
        from: buyer,
        value: web3.utils.toWei("1", "Ether"),
      }).should.be.rejected;
    });
  });
});
