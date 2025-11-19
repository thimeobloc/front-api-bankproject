import React from "react";
import Home from "./pages/Home/Home";
import Beneficiary  from "./pages/Beneficiary/Beneficiary";
import { Routes, Route } from 'react-router-dom'
import Signing from "./pages/Signin/Signin";
import Login from "./pages/Login/Login";
import Deposit from "./pages/Deposit/Deposit";
import Transfert from "./pages/Transfert/Transfert";

export default function App() {
  return  ( 
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/Signing" element={<Signing />} />
    <Route path="/Login" element={<Login />} />
    <Route path="/beneficiary" element={<Beneficiary />} />
    <Route path="/beneficiary" element={<Deposit />} />
    <Route path="/beneficiary" element={<Transfert />} />
  </Routes>
  ) 
}
