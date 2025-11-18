import React from "react";
import Home from "./pages/Home/Home";
import { Routes, Route } from 'react-router-dom'
import Signing from "./pages/Signin/Signin";
import Login from "./pages/Login/Login";

export default function App() {
  return  ( 
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/Signing" element={<Signing />} />
    <Route path="/Login" element={<Login />} />
  </Routes>
  ) 
}
