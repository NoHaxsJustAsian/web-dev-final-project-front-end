import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login_Register/Login";
import ProfilePage from "./Profile/ProfilePage";
import Details from "./Details/Details";

function App() {
  const isLoggedIn = true; // Mock value, replace with actual auth state

  
  return (
    <Router>
      <Routes>
        <Route path="/"/>
        <Route path="/login" element = {<Login />}/>
        <Route path="/profile" element={<ProfilePage isLoggedIn={isLoggedIn} />} />
        <Route path="/profile/:profileId" element={<ProfilePage isLoggedIn={isLoggedIn} />} />
        <Route path="/details/:postId" element={<Details />} />
      </Routes>
    </Router>
  );
}

export default App;
