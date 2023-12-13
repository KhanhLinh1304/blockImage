import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import Card from "../contracts/Card.json";
import Navbar from "./Navbar";
import Main from "./Main";
import {Route,Routes } from "react-router-dom";
import AddProduct from "./AddProduct";




class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const networkId = await web3.eth.net.getId();
    const networkData = Card.networks[networkId];
    if (networkData) {
      const card = new web3.eth.Contract(
        Card.abi,
        networkData.address
      );
      this.setState({ card });
      const productCount = await card.methods.productCount().call();
      this.setState({ productCount });
      
      // Load products
      const products = [];
      for (var i = productCount; i >= 1; i--) {
        const product = await card.methods.products(i).call();
        products.push(product);
      }
      
      this.setState({
        products: products,
        loading: false
      });
    } else {
      window.alert("Marketplace contract not deployed to detected network.");
    }
  }
  

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      productCount: 0,
      products: [],
      loading: true,
    };

    this.createProduct = this.createProduct.bind(this);
    this.purchaseProduct = this.purchaseProduct.bind(this);
  }
  
  createProduct(name, price, imageURL) {
    this.setState({ loading: true });

    // Assuming imageURL is a File object from an input type="file"
    const reader = new FileReader();

    reader.onloadend = async () => {
        const imageBase64 = reader.result.split(',')[1]; // Extract Base64 data

        this.state.card.methods
            .createProduct(name, price, imageBase64)
            .send({ from: this.state.account })
            .once("receipt", (receipt) => {
                this.setState({ loading: false });
            });
    };

    if (imageURL) {
        reader.readAsDataURL(imageURL); // Read the image file
    } else {
        // Handle the case when no image is selected
        console.error("No image selected");
        this.setState({ loading: false });
    }
}


  purchaseProduct(id, price, imageURL) {
    this.setState({ loading: true });
  
    // Sending a transaction to the smart contract's purchaseProduct method
    this.state.card.methods
      .purchaseProduct(id)
      .send({ from: this.state.account, value: price, imageURL: imageURL }) // Pass imageURL
      .once("receipt", (receipt) => {
        // Transaction is confirmed, update loading state to false
        this.setState({ loading: false });
      });
  }
  


  render() {
    return (
    
      <div>
        <Navbar account={this.state.account}  />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              {this.state.loading ? (
                <div id="loader" className="text-center">
                  <p className="text-center">Loading...</p>
                </div>
              ) : (
            <Routes>
            <Route path="/"
                   element={<Main products={this.state.products}
                   purchaseProduct={this.purchaseProduct} />}
                    />
            <Route path="/addProduct"
                   element={<AddProduct createProduct={this.createProduct} />} />
      </Routes>
      )}
       </main>
          </div>
        </div>
      </div>
     
    );
  }
 
}

export default App;
