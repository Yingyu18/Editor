import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import reportWebVitals from './reportWebVitals';


// document.getElementById('root').innerHTML =
// marked.parse('# Marked in the browser\n\nRendered by **marked**.');
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
//  <Router>
//    <Route path="/page" component={App}>
//    </Route>
//  </Router>
   <React.StrictMode>
    <App />
  </React.StrictMode> 
);
// const myContainer = ReactDOM.createRoot(document.getElementById('myContainer'));
// myContainer.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
