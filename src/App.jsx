import React from "react";
import Home from "./pages/Home/Home";
import { Routes, Route } from 'react-router-dom'

export default function App() {
  return  ( 
  <Routes>
    <Route path="/" element={<Home />} />
  </Routes>
  ) 
}
