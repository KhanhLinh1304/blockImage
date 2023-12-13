import React, { Component } from "react";

class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
    };
  }

  handleFileChange = (event) => {
    this.setState({ file: event.target.files[0] });
  };

  render() {
    return (
      <div
        id="content"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <div
          style={{
            boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
            width: "600px",
            marginLeft: "350px",
            marginTop: "40px",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <h1 style={{ marginTop: "20px", marginBottom: "20px" }}>
            Add Product
          </h1>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const name = this.productName.value;
              const price = window.web3.utils.toWei(
                this.productPrice.value.toString(),
                "ether"
              );
              const imageURL = this.state.file;
              this.props.createProduct(name, price, imageURL);
            }}
          >
            <div className="form-group mr-sm-2">
              <input
                id="productName"
                type="text"
                ref={(input) => {
                  this.productName = input;
                }}
                className="form-control"
                placeholder="Product Name"
                required
              />
            </div>
            <div className="form-group mr-sm-2">
              <input
                id="productPrice"
                type="text"
                ref={(input) => {
                  this.productPrice = input;
                }}
                className="form-control"
                placeholder="Product Price"
                required
              />
            </div>
            <div className="form-group mr-sm-2">
              <label htmlFor="imageURL">Product Image</label>
              <input
                id="imageURL"
                type="file"
                onChange={this.handleFileChange}
                className="form-control-file"
              />
            </div>
            <button type="submit" className="btn btn-warning">
              Add Product
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default AddProduct;
