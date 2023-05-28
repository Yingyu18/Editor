import React from 'react';
import './App.css';
const {Toggle, Editor} = require('./components/editor');
function App() {
  return (
    <div className="App">
      <h1>Editor</h1>
      <Editor/>
      {/* <Toggle/> */}
    </div>
  );
}

export default App;
