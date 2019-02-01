import React, { Component } from 'react';
import FormContainer from "./FormContainer"
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <FormContainer />
        </header>
      </div>
    );
  }
}

export default App;
