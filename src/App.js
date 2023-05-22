import React from 'react';
import './App.css';
const {DraftEditor,Markdown, Keydash, Toggle, Editor } = require('./components/editor');
function App() {
  return (
    <div className="App">
      <h1>Editor</h1>
      <Editor/>
      {/* <Keydash/> */}
      <Toggle/>
    </div>
  );
}

export default App;
