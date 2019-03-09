import React, { Component } from "react";
import logo from "./logo.png";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div className="soon">
            <p>COMING SOON</p>
          </div>
          <div className="footer">
            <p>Media Make Change 2019</p>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
