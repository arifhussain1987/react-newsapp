import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Routes, Link, NavLink} from 'react-router-dom'
import Python from "./components/Python"
import Javascript from "./components/Javascript"

const Root = () => 
<BrowserRouter>
<div>
  <Link to="/">Home</Link>
  <Link to="/python">python</Link>
  <Link to="/javascript">javascript</Link>

    <Routes>
      <Route exact path="/" element={<App />} />
      <Route exact path="/python" element={<Python /> } />
      <Route exact path="/javascript" element={<Javascript /> } />
    </Routes>
 
</div>
</BrowserRouter>


const About = () => 
<div>
  <h1>This is About page...</h1>
</div>

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
