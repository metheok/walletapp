import React from "react";
import "./App.css";
import Home from "./components/home";
import Transactions from "./components/transactions";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      {" "}
      <div className="App ">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <Link class="navbar-brand" to="/">
            WalletApp
          </Link>
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav">
              <li class="nav-item">
                <Link class="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/transactions">
                  Transactions
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route exact path="/transactions" element={<Transactions />}></Route>
        </Routes>
      </div>
    </Router>
  );
}
export default App;
