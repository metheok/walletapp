import React from "react";
import "./App.css";
import logo from "./logo.svg";
import Home from "./components/home";
import Transactions from "./components/transactions";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      {" "}
      <div className="App">
        <header className="App-topbar">
          <Link to="/">
            <img src={logo} className="App-logo" alt="logo" />
          </Link>

          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/transactions">Transactions</Link>
            </li>
          </ul>
        </header>

        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route exact path="/transactions" element={<Transactions />}></Route>
        </Routes>
      </div>
    </Router>
  );
}
export default App;
