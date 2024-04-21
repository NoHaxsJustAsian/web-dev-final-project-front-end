import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login_Register/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element = {<Login />}>
        </Route>
        <Route path="/">
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
