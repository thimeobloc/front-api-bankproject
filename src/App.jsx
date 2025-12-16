import React, { useState } from "react";
import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home/Home";
import Account from "./pages/Account/Account";
import Historique from "./pages/Historique/Historique";
import Beneficiary from "./pages/Beneficiary/Beneficiary";
import Signing from "./pages/SignIn/SignIn";
import Login from "./pages/Login/Login";
import Deposit from "./pages/Deposit/Deposit";
import Transfert from "./pages/Transfert/Transfert";
import Header from './components/layouts/header/header.jsx';

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return (
    <>
      <Header user={user} setUser={setUser} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account/:id" element={<Account />} />
          <Route path="/Signing" element={<Signing />} />
          <Route path="/Login" element={<Login setUser={setUser} />} />
          <Route path="/beneficiary" element={<Beneficiary />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/transfert" element={<Transfert />} />
          <Route path="/historique" element={<Historique />} />
        </Routes>
      </main>
    </>
  )
}
